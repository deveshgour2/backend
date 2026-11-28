import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const MAX_IMAGES = 7;

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "INR (₹) — Indian Rupee" },
  { code: "USD", symbol: "$", label: "USD ($) — US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) — Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) — British Pound" },
];

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Revoke object URLs on unmount to prevent memory leaks
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const activeCurrency =
    CURRENCIES.find((c) => c.code === form.priceCurrency) || CURRENCIES[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );
    if (!incoming.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    if (incoming.length > remainingSlots) {
      setError(`Only ${remainingSlots} more image${remainingSlots > 1 ? "s" : ""} can be added (max ${MAX_IMAGES}).`);
    } else {
      setError("");
    }

    const accepted = incoming.slice(0, remainingSlots).map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...accepted]);
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== id);
    });
    if (error) setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a product title.");
      return;
    }
    if (!form.description.trim()) {
      setError("Please enter a product description.");
      return;
    }
    if (!form.priceAmount || Number(form.priceAmount) <= 0) {
      setError("Please enter a valid price amount.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least 1 product image.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("priceAmount", form.priceAmount);
      formData.append("priceCurrency", form.priceCurrency);
      images.forEach((item) => {
        formData.append("images", item.file);
      });

      await handleCreateProduct(formData);
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not publish product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">
        {/* Top bar */}
        <header className="mb-12 flex flex-col gap-6 border-b border-zinc-800/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span
                className="text-lg font-bold tracking-widest uppercase"
                style={{ color: "#F5C518", fontFamily: "Inter, sans-serif" }}
              >
                Dripora.
              </span>
              <span className="h-3.5 w-px bg-zinc-800" />
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-xs font-medium tracking-wide text-zinc-400 transition-colors hover:text-[#F5C518]"
              >
                ← Back
              </button>
            </div>

            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#F5C518" }}
            >
              Seller Studio • New Listing
            </p>
            <h1
              className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Add New Piece
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              Publish a new garment or collection piece to the Dripora catalog.
            </p>
          </div>
        </header>

        {/* Horizontal 2-column form on desktop */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* ── LEFT COLUMN (7/12): Product Details ── */}
            <section className="space-y-7 rounded-2xl border border-zinc-800/90 bg-[#121215] p-6 sm:p-8 lg:col-span-7">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="title"
                  className="text-xs font-medium uppercase tracking-widest text-zinc-400"
                >
                  Product Title <span style={{ color: "#F5C518" }}>*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Oversized Cashmere Trench Coat"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-800 bg-[#18181b] px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/15"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="description"
                  className="text-xs font-medium uppercase tracking-widest text-zinc-400"
                >
                  Description <span style={{ color: "#F5C518" }}>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Describe silhouette, fabric weight, craftsmanship, and fit..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-[#18181b] p-4 text-sm leading-relaxed text-white placeholder-zinc-600 outline-none transition-all focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/15"
                />
                <p className="text-xs text-zinc-500">
                  Include fabric composition, care notes, and fit details.
                </p>
              </div>

              {/* Pricing row (horizontal on sm+) */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Price Amount */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="priceAmount"
                    className="text-xs font-medium uppercase tracking-widest text-zinc-400"
                  >
                    Price Amount <span style={{ color: "#F5C518" }}>*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-4 text-sm font-medium text-zinc-400">
                      {activeCurrency.symbol}
                    </span>
                    <input
                      id="priceAmount"
                      name="priceAmount"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={form.priceAmount}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-800 bg-[#18181b] py-3.5 pr-4 pl-9 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/15"
                    />
                  </div>
                </div>

                {/* Price Currency */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="priceCurrency"
                    className="text-xs font-medium uppercase tracking-widest text-zinc-400"
                  >
                    Currency <span style={{ color: "#F5C518" }}>*</span>
                  </label>
                  <select
                    id="priceCurrency"
                    name="priceCurrency"
                    value={form.priceCurrency}
                    onChange={handleChange}
                    className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-[#18181b] px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/15"
                  >
                    {CURRENCIES.map((currency) => (
                      <option
                        key={currency.code}
                        value={currency.code}
                        className="bg-[#18181b] text-white"
                      >
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* ── RIGHT COLUMN (5/12): Product Imagery (up to 7) ── */}
            <section className="flex flex-col justify-between space-y-6 rounded-2xl border border-zinc-800/90 bg-[#121215] p-6 sm:p-8 lg:col-span-5">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-widest text-zinc-300">
                    Product Imagery <span style={{ color: "#F5C518" }}>*</span>
                  </label>
                  <span
                    className="rounded-full border px-3 py-1 text-xs font-semibold tracking-wider"
                    style={{
                      borderColor: "rgba(245, 197, 24, 0.35)",
                      color: "#F5C518",
                      backgroundColor: "rgba(245, 197, 24, 0.08)",
                    }}
                  >
                    {images.length} / {MAX_IMAGES}
                  </span>
                </div>

                {/* Dropzone */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    images.length < MAX_IMAGES && fileInputRef.current?.click()
                  }
                  onKeyDown={(e) => {
                    if (
                      (e.key === "Enter" || e.key === " ") &&
                      images.length < MAX_IMAGES
                    ) {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition-all ${
                    images.length >= MAX_IMAGES
                      ? "cursor-not-allowed border-zinc-800 bg-[#18181b]/30 opacity-50"
                      : isDragging
                      ? "border-[#F5C518] bg-[#F5C518]/10"
                      : "border-zinc-700 bg-[#18181b]/50 hover:border-[#F5C518] hover:bg-[#18181b]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={images.length >= MAX_IMAGES}
                    onChange={(e) => {
                      if (e.target.files?.length) addFiles(e.target.files);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />

                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-[#09090b]"
                    style={{ color: "#F5C518" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>

                  <p className="text-sm font-medium text-white transition-colors group-hover:text-[#F5C518]">
                    {images.length >= MAX_IMAGES
                      ? "Maximum 7 images reached"
                      : "Drop garment photos here or browse"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Up to {MAX_IMAGES} images (JPG, PNG, WEBP)
                  </p>
                </div>

                {/* 7-slot preview grid */}
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: MAX_IMAGES }).map((_, idx) => {
                    const item = images[idx];

                    if (item) {
                      return (
                        <div
                          key={item.id}
                          className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b]"
                        >
                          <img
                            src={item.preview}
                            alt={`Product preview ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />

                          {idx === 0 && (
                            <span
                              className="absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black"
                              style={{ backgroundColor: "#F5C518" }}
                            >
                              Cover
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item.id)}
                            aria-label={`Remove image ${idx + 1}`}
                            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-xs text-white opacity-0 transition-opacity hover:bg-[#F5C518] hover:text-black group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={`slot-${idx}`}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex aspect-[3/4] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-[#18181b]/40 text-zinc-600 transition-colors hover:border-zinc-600 hover:text-zinc-400"
                      >
                        <span className="text-base leading-none">+</span>
                        <span className="mt-1 text-[10px] tracking-wider uppercase">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-zinc-500">
                First image will be showcased as the cover on collection feeds.
              </p>
            </section>
          </div>

          {/* Error banner */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex flex-col-reverse items-stretch justify-end gap-4 border-t border-zinc-800/80 pt-8 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-zinc-800 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: "#F5C518",
                boxShadow: "0 0 24px rgba(245, 197, 24, 0.2)",
              }}
            >
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
