import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2, X, ImageUp, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useRooms } from '../../hooks/useRooms';
import type { Room } from '../../types';
import { supabase } from '../../supabaseClient';

const ROOMS_TABLE = 'Aura-basic-rooms';
const BUCKET = 'Aura-basic-room-images';

function safeExt(mime: string | undefined) {
  if (!mime) return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/jpeg') return 'jpg';
  return 'jpg';
}

async function uploadRoomImage(file: File) {
  const ext = safeExt(file.type);
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `rooms/${fileName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

type EditingRoom = Omit<Room, 'id'> & { id?: string };

const emptyRoom: EditingRoom = {
  name: '',
  description: '',
  price: 0,
  image: '',
  features: [],
  max_guests: 1,
  is_featured: false,
};

const AdminRooms: React.FC = () => {
  const { rooms, loading, error, refetch } = useRooms();

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<EditingRoom | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const editingIsNew = useMemo(() => Boolean(editing && !editing.id), [editing]);

  useEffect(() => {
    if (!editing) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [editing]);

  const showToast = (type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3500);
  };

  const startCreate = () => {
    setCreating(true);
    setEditing({ ...emptyRoom });
  };

  const startEdit = (room: Room) => {
    setCreating(false);
    setEditing({ ...room });
  };

  const closeEditor = () => {
    setEditing(null);
    setCreating(false);
  };

  const onPickImage = async (file: File | null) => {
    if (!file || !editing) return;
    setBusy(true);
    try {
      const url = await uploadRoomImage(file);
      setEditing({ ...editing, image: url });
      showToast('ok', 'Image uploaded.');
    } catch (e: any) {
      console.error('Image upload error', e);
      showToast('err', e?.message || 'Failed to upload image.');
    } finally {
      setBusy(false);
    }
  };

  const saveRoom = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const payload = {
        name: editing.name.trim(),
        description: editing.description.trim(),
        price: Number(editing.price),
        image: editing.image.trim(),
        features: editing.features,
        max_guests: Number(editing.max_guests),
        is_featured: Boolean(editing.is_featured),
      };

      if (!payload.name || !payload.description || !payload.image) {
        showToast('err', 'Name, description, and image are required.');
        setBusy(false);
        return;
      }

      if (editing.id) {
        const { error: updateError } = await supabase
          .from(ROOMS_TABLE)
          .update(payload)
          .eq('id', editing.id);
        if (updateError) throw updateError;
        showToast('ok', 'Room updated.');
      } else {
        const { error: insertError } = await supabase
          .from(ROOMS_TABLE)
          .insert({ ...payload, id: crypto.randomUUID() });
        if (insertError) throw insertError;
        showToast('ok', 'Room created.');
      }

      closeEditor();
      refetch();
    } catch (e: any) {
      console.error('Save room error', e);
      showToast('err', e?.message || 'Failed to save room.');
    } finally {
      setBusy(false);
    }
  };

  const deleteRoom = async (room: Room) => {
    const ok = window.confirm(`Delete room "${room.name}"? This cannot be undone.`);
    if (!ok) return;
    setBusy(true);
    try {
      const { error: delError } = await supabase.from(ROOMS_TABLE).delete().eq('id', room.id);
      if (delError) throw delError;
      showToast('ok', 'Room deleted.');
      refetch();
    } catch (e: any) {
      console.error('Delete room error', e);
      showToast('err', e?.message || 'Failed to delete room.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${toast.type === 'ok'
              ? 'bg-green-50 border-green-100 text-green-800'
              : 'bg-red-50 border-red-100 text-red-800'
            }`}
        >
          {toast.type === 'ok' ? <CheckCircle2 size={18} className="mt-0.5" /> : <AlertTriangle size={18} className="mt-0.5" />}
          <div>{toast.text}</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900">Rooms</h2>
          <p className="text-sm text-gray-500">Add, edit, and remove room listings. Images upload to the database.</p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="animate-spin" size={16} /> Loading rooms...
        </div>
      )}
      {error && <div className="text-sm text-red-700">Failed to load rooms: {error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-40 bg-gray-100 overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{room.name}</h3>
                      {room.is_featured ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-gray-500">ETB {room.price.toLocaleString()} / night • Max {room.max_guests}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(room)}
                      className="px-3 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-amber-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRoom(room)}
                      className="px-3 py-2 rounded-xl text-sm font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={busy ? undefined : closeEditor} />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold">{editingIsNew ? 'Add Room' : 'Edit Room'}</h3>
                <p className="text-xs text-gray-300">Rooms table: {ROOMS_TABLE}</p>
              </div>
              <button onClick={closeEditor} disabled={busy} className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-60">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-84px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Name</label>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-amber-500 outline-none text-sm"
                    placeholder="Room name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Price (ETB)</label>
                  <input
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    type="number"
                    min={0}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-amber-500 outline-none text-sm"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Max guests</label>
                  <input
                    value={editing.max_guests}
                    onChange={(e) => setEditing({ ...editing, max_guests: Number(e.target.value) })}
                    type="number"
                    min={1}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-amber-500 outline-none text-sm"
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Featured</label>
                  <select
                    value={editing.is_featured ? 'yes' : 'no'}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.value === 'yes' })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-amber-500 outline-none text-sm"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-amber-500 outline-none text-sm"
                  placeholder="Room description"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Features (comma separated)</label>
                <input
                  value={editing.features.join(', ')}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      features: e.target.value
                        .split(',')
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-amber-500 outline-none text-sm"
                  placeholder="Free Wi-Fi, Breakfast, Parking"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Room image</label>
                    <p className="text-xs text-gray-400">Uploads to bucket: {BUCKET}</p>
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-amber-600 transition-colors cursor-pointer">
                    <ImageUp size={16} />
                    Upload
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
                      disabled={busy}
                    />
                  </label>
                </div>

                {editing.image ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                    <img src={editing.image} alt="Room preview" className="w-full h-56 object-cover" />
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No image uploaded yet.</div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={closeEditor}
                  disabled={busy}
                  className="px-5 py-3 rounded-xl bg-gray-100 text-gray-900 font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={saveRoom}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-wait"
                >
                  {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;

