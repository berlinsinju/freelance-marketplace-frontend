import React, { useRef, useState } from "react";
import api, { fileUrl } from "../api/axios";

export const MAX_SAMPLES = 8;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

const formatSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const SampleUploader = ({ samples = [], onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const remaining = MAX_SAMPLES - samples.length;

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setError("");

    if (files.length > remaining) {
      setError(`You can add ${remaining} more sample${remaining === 1 ? "" : "s"}.`);
      return;
    }

    const tooBig = files.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than 5MB.`);
      return;
    }

    const wrongType = files.find((f) => !ACCEPTED.includes(f.type));
    if (wrongType) {
      setError(`"${wrongType.name}" is not a JPG, PNG, WEBP, GIF or PDF.`);
      return;
    }

    const data = new FormData();
    files.forEach((f) => data.append("samples", f));

    setUploading(true);
    setProgress(0);
    try {
      const res = await api.post("/services/samples", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      onChange([...samples, ...res.data.files]);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const addLink = () => {
    const url = linkUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setError("Links must start with http:// or https://");
      return;
    }
    if (remaining <= 0) {
      setError(`You can add at most ${MAX_SAMPLES} samples.`);
      return;
    }
    setError("");
    onChange([...samples, { url, caption: "", fileType: "link", fileName: url, size: 0 }]);
    setLinkUrl("");
  };

  const updateCaption = (index, caption) => {
    const next = samples.map((s, i) => (i === index ? { ...s, caption } : s));
    onChange(next);
  };

  const removeSample = (index) => {
    onChange(samples.filter((_, i) => i !== index));
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= samples.length) return;
    const next = [...samples];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!uploading && remaining > 0) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Work Samples</label>
        <span className="text-xs text-gray-400">
          {samples.length}/{MAX_SAMPLES}
        </span>
      </div>
      <p className="mb-3 text-xs text-gray-500">
        Show clients what you can do. JPG, PNG, WEBP, GIF or PDF up to 5MB each — or link to work
        hosted elsewhere.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && remaining > 0 && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
          dragging
            ? "border-teal-700 bg-teal-50"
            : "border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/40"
        } ${remaining <= 0 || uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
        {uploading ? (
          <div className="w-full max-w-xs">
            <p className="mb-2 text-sm font-medium text-teal-800">Uploading… {progress}%</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-teal-100">
              <div
                className="h-full rounded-full bg-teal-700 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <svg
              className="mb-2 h-8 w-8 text-teal-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9m0 0L8.25 12.75M12 9l3.75 3.75M3 16.5v1.875A2.625 2.625 0 005.625 21h12.75A2.625 2.625 0 0021 18.375V16.5"
              />
            </svg>
            <p className="text-sm font-medium text-gray-700">
              {remaining > 0 ? (
                <>
                  Drag &amp; drop files here, or <span className="text-teal-700">browse</span>
                </>
              ) : (
                "Sample limit reached"
              )}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {remaining > 0
                ? `${remaining} slot${remaining === 1 ? "" : "s"} remaining`
                : "Remove one to add another"}
            </p>
          </>
        )}
      </div>

      {/* External link */}
      <div className="mt-3 flex gap-2">
        <input
          type="url"
          placeholder="Or paste a link (Behance, GitHub, Figma…)"
          className="h-11 flex-1 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addLink();
            }
          }}
        />
        <button
          type="button"
          onClick={addLink}
          disabled={!linkUrl.trim() || remaining <= 0}
          className="rounded-xl border border-teal-700 px-4 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add link
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Previews */}
      {samples.length > 0 && (
        <ul className="mt-4 space-y-3">
          {samples.map((s, i) => (
            <li
              key={`${s.url}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {s.fileType === "image" ? (
                  <img
                    src={fileUrl(s.url)}
                    alt={s.caption || s.fileName || "Work sample"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold uppercase text-teal-700">
                    {s.fileType === "pdf" ? "PDF" : "Link"}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-gray-500">
                  {s.fileName || s.url}
                  {s.size ? ` · ${formatSize(s.size)}` : ""}
                </p>
                <input
                  placeholder="Add a caption (optional)"
                  maxLength={140}
                  className="mt-1 h-9 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                  value={s.caption || ""}
                  onChange={(e) => updateCaption(i, e.target.value)}
                />
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move sample up"
                  className="rounded px-2 text-xs text-gray-400 transition hover:text-teal-700 disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === samples.length - 1}
                  aria-label="Move sample down"
                  className="rounded px-2 text-xs text-gray-400 transition hover:text-teal-700 disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeSample(i)}
                aria-label="Remove sample"
                className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SampleUploader;
