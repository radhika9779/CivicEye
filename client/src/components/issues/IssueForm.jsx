import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Crosshair, Upload, Camera, X, ChevronRight, ChevronLeft } from 'lucide-react';
import L from 'leaflet';
import toast from 'react-hot-toast';
import { CATEGORIES, getCategoryConfig } from '../../utils/categoryConfig';
import { reverseGeocode } from '../../utils/geocode';
import { useGeolocation } from '../../hooks/useGeolocation';
import Button from '../common/Button';

const DEFAULT_POSITION = { lat: 19.076, lon: 72.8777 };

const markerIcon = L.divIcon({
  className: '',
  html: `<div class="civic-pin" style="background:#2563EB;"><div class="civic-pin-dot"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

/**
 * react-leaflet's MapContainer `center` prop only sets the *initial* view —
 * it does not pan the map when the prop changes later. Without this, tapping
 * "Use my location" moves the marker but leaves the viewport stuck on the
 * old center, so if your real position is far from the default it looks
 * like the button did nothing.
 */
function RecenterOnChange({ position }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([position.lat, position.lon], map.getZoom());
  }, [position.lat, position.lon, map]);
  return null;
}

function LocationPicker({ position, onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return (
    <Marker
      position={[position.lat, position.lon]}
      draggable
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          onPick({ lat, lon: lng });
        },
      }}
    />
  );
}

export default function IssueForm({ onSubmit, submitting }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [address, setAddress] = useState('');
  const [addressEditedByUser, setAddressEditedByUser] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { loading: locating, detect } = useGeolocation();

  const canContinueStep1 = category && title.trim().length > 0;

  // Reverse-geocode whenever the pin moves, unless the user has already
  // typed their own address — we don't want to clobber a manual edit.
  React.useEffect(() => {
    if (addressEditedByUser) return;
    let cancelled = false;
    setGeocoding(true);
    reverseGeocode(position.lat, position.lon).then((result) => {
      if (!cancelled && result) {
        setAddress(result);
      }
      if (!cancelled) setGeocoding(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position.lat, position.lon]);

  const handleUseMyLocation = async () => {
    try {
      const coords = await detect();
      setPosition(coords);
    } catch (err) {
      toast.error(err.message || 'Could not detect your location');
    }
  };

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }, []);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('latitude', position.lat);
    formData.append('longitude', position.lon);
    formData.append('address', address || `${position.lat.toFixed(5)}, ${position.lon.toFixed(5)}`);
    formData.append('is_anonymous', isAnonymous);
    if (photo) formData.append('photo', photo);
    onSubmit(formData);
  };

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-civic-blue' : 'bg-civic-border'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-semibold mb-2 block">What's the issue?</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const config = getCategoryConfig(cat);
                const Icon = config.icon;
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors ${
                      active ? 'border-civic-blue bg-blue-50' : 'border-civic-border hover:border-slate-300'
                    }`}
                  >
                    <Icon size={20} style={{ color: active ? '#2563EB' : config.color }} />
                    <span className="text-xs font-medium text-center">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="issue-title" className="text-sm font-semibold mb-1.5 block">
              Title
            </label>
            <input
              id="issue-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large pothole near bus stop"
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="issue-desc" className="text-sm font-semibold mb-1.5 block">
              Description
            </label>
            <textarea
              id="issue-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what's wrong and why it matters — specific details help our AI score it accurately."
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm resize-none"
            />
          </div>

          <Button fullWidth disabled={!canContinueStep1} onClick={() => setStep(2)} icon={ChevronRight}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Pin the location</label>
            <p className="text-xs text-civic-ink mb-2">Tap the map or drag the pin to adjust.</p>
            <div className="h-56 rounded-xl overflow-hidden border border-civic-border">
              <MapContainer
                center={[position.lat, position.lon]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker position={position} onPick={setPosition} />
                <RecenterOnChange position={position} />
              </MapContainer>
            </div>
          </div>

          <button
            onClick={handleUseMyLocation}
            disabled={locating}
            className="flex items-center gap-2 text-sm font-medium text-civic-blue"
          >
            <Crosshair size={16} className={locating ? 'animate-spin' : ''} />
            {locating ? 'Detecting…' : 'Use my location'}
          </button>

          <div>
            <label htmlFor="issue-address" className="text-sm font-semibold mb-1.5 block flex items-center gap-2">
              Address
              {geocoding && <span className="text-xs font-normal text-civic-ink">detecting…</span>}
            </label>
            <input
              id="issue-address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setAddressEditedByUser(true);
              }}
              placeholder={`${position.lat.toFixed(5)}, ${position.lon.toFixed(5)}`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-civic-border focus:border-civic-blue outline-none text-sm"
            />
            {addressEditedByUser && (
              <button
                type="button"
                onClick={async () => {
                  setAddressEditedByUser(false);
                  setGeocoding(true);
                  const result = await reverseGeocode(position.lat, position.lon);
                  if (result) setAddress(result);
                  setGeocoding(false);
                }}
                className="text-xs font-medium text-civic-blue mt-1"
              >
                Use auto-detected address instead
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)} icon={ChevronLeft}>
              Back
            </Button>
            <Button fullWidth onClick={() => setStep(3)} icon={ChevronRight}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Add a photo (optional)</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-6 transition-colors ${
                dragOver ? 'border-civic-blue bg-blue-50' : 'border-civic-border'
              }`}
              style={{ minHeight: 160 }}
            >
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="Preview" className="max-h-32 rounded-lg mb-2" />
                  <button
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-card"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <p className="text-sm text-civic-ink mb-3">Drag & drop a photo, or</p>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-civic-blue cursor-pointer px-3 py-1.5 rounded-lg border border-civic-blue/30 hover:bg-blue-50">
                      <Camera size={15} />
                      Take photo
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-civic-blue cursor-pointer px-3 py-1.5 rounded-lg border border-civic-blue/30 hover:bg-blue-50">
                      <Upload size={15} />
                      Browse files
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded accent-civic-blue"
            />
            <span className="text-sm text-civic-ink">Report anonymously</span>
          </label>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)} icon={ChevronLeft}>
              Back
            </Button>
            <Button fullWidth onClick={handleSubmit} loading={submitting}>
              Submit Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
