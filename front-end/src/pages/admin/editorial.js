import { useState } from "react";

import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { requireAdmin } from "@/services/adminService";
import {
  deleteBlog,
  deleteHiddenGem,
  deleteOffering,
  getBlogs,
  getHiddenGems,
  getOfferings,
  updateBlog,
  updateHiddenGem,
  updateOffering,
} from "@/services/contentServices";

const EDITORIAL_TABS = [
  { key: "blogs", label: "Blogs" },
  { key: "hiddenGems", label: "Hidden Gems" },
  { key: "offerings", label: "Offerings" },
];

function getItemId(item) {
  return item?._id || item?.id || item?.blogId || item?.hiddenGemId || item?.offeringId || "";
}

function getTitle(type, item) {
  if (type === "hiddenGems") return item?.PlaceName || item?.placeName || "Untitled hidden gem";
  return item?.title || item?.name || "Untitled item";
}

function getDescription(type, item) {
  if (type === "blogs") return item?.content || "";
  if (type === "hiddenGems") return item?.Description || item?.description || "";
  return item?.description || "";
}

function getImageUrl(item) {
  const image = item?.images?.[0] || item?.image?.[0] || item?.image;
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || item?.imageUrl || "";
}

function getPreview(text = "") {
  if (!text) return "No description provided.";
  return text.length > 160 ? `${text.slice(0, 160)}...` : text;
}

function buildInitialForm(type, item) {
  if (type === "blogs") {
    return {
      title: item?.title || "",
      content: item?.content || "",
      image: null,
    };
  }

  if (type === "hiddenGems") {
    return {
      PlaceName: item?.PlaceName || item?.placeName || "",
      Description: item?.Description || item?.description || "",
    };
  }

  return {
    title: item?.title || "",
    city: item?.city || "",
    description: item?.description || "",
    price: item?.price ?? "",
    reviews: item?.reviews || "",
    image: null,
  };
}

function mergeUpdatedItem(type, item, form) {
  if (type === "blogs") {
    return {
      ...item,
      title: form.title,
      content: form.content,
    };
  }

  if (type === "hiddenGems") {
    return {
      ...item,
      PlaceName: form.PlaceName,
      placeName: form.PlaceName,
      Description: form.Description,
      description: form.Description,
    };
  }

  return {
    ...item,
    title: form.title,
    city: form.city,
    description: form.description,
    price: form.price,
    reviews: form.reviews,
  };
}

export default function AdminEditorial({
  admin,
  initialBlogs = [],
  initialHiddenGems = [],
  initialOfferings = [],
  initialError = "",
}) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("blogs");
  const [collections, setCollections] = useState({
    blogs: initialBlogs,
    hiddenGems: initialHiddenGems,
    offerings: initialOfferings,
  });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState({
    saving: false,
    deletingId: "",
    success: "",
    error: initialError,
  });

  const activeItems = collections[activeTab] || [];

  const startEdit = (type, item) => {
    setEditing({ type, id: getItemId(item) });
    setForm(buildInitialForm(type, item));
    setStatus((current) => ({ ...current, success: "", error: "" }));
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({});
  };

  const updateCollectionItem = (type, id, nextItem) => {
    setCollections((current) => ({
      ...current,
      [type]: current[type].map((item) => (getItemId(item) === id ? nextItem : item)),
    }));
  };

  const removeCollectionItem = (type, id) => {
    setCollections((current) => ({
      ...current,
      [type]: current[type].filter((item) => getItemId(item) !== id),
    }));
  };

  const handleSave = async (type, item) => {
    const id = getItemId(item);
    setStatus({ saving: true, deletingId: "", success: "", error: "" });

    try {
      let updatedItem = mergeUpdatedItem(type, item, form);

      if (type === "blogs") {
        const formData = new FormData();
        formData.append("title", form.title || "");
        formData.append("content", form.content || "");
        if (form.image) formData.append("image", form.image);
        await updateBlog(id, formData);
      } else if (type === "hiddenGems") {
        await updateHiddenGem(id, {
          PlaceName: form.PlaceName || "",
          Description: form.Description || "",
        });
      } else {
        const formData = new FormData();
        formData.append("title", form.title || "");
        formData.append("city", form.city || "");
        formData.append("description", form.description || "");
        formData.append("reviews", form.reviews || "");
        if (form.price !== "") formData.append("price", form.price);
        if (form.image) formData.append("image", form.image);

        const response = await updateOffering(id, formData);
        updatedItem = response?.offering || updatedItem;
      }

      updateCollectionItem(type, id, updatedItem);
      setEditing(null);
      setForm({});
      setStatus({
        saving: false,
        deletingId: "",
        success: "Item updated successfully.",
        error: "",
      });
    } catch (error) {
      setStatus({
        saving: false,
        deletingId: "",
        success: "",
        error: error.message || "Item could not be updated.",
      });
    }
  };

  const handleDelete = async (type, item) => {
    const id = getItemId(item);
    const title = getTitle(type, item);

    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setStatus({ saving: false, deletingId: id, success: "", error: "" });

    try {
      if (type === "blogs") await deleteBlog(id);
      if (type === "hiddenGems") await deleteHiddenGem(id);
      if (type === "offerings") await deleteOffering(id);

      removeCollectionItem(type, id);
      setStatus({
        saving: false,
        deletingId: "",
        success: "Item deleted successfully.",
        error: "",
      });
    } catch (error) {
      setStatus({
        saving: false,
        deletingId: "",
        success: "",
        error: error.message || "Item could not be deleted.",
      });
    }
  };

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editorial</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage blogs, hidden gems, and offerings from real content APIs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {EDITORIAL_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  cancelEdit();
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-[#0b1d3a] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Summary title="Blogs" value={collections.blogs.length} />
          <Summary title="Hidden Gems" value={collections.hiddenGems.length} />
          <Summary title="Offerings" value={collections.offerings.length} />
        </div>

        {status.error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {status.error}
          </p>
        )}

        {status.success && (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {status.success}
          </p>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-bold text-slate-900">
            {EDITORIAL_TABS.find((tab) => tab.key === activeTab)?.label}
          </h2>

          {activeItems.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
              No items found.
            </p>
          ) : (
            <ul className="mt-4 grid gap-4 xl:grid-cols-2">
              {activeItems.map((item) => (
                <EditorialItem
                  key={getItemId(item)}
                  type={activeTab}
                  item={item}
                  editing={editing}
                  form={form}
                  setForm={setForm}
                  onEdit={startEdit}
                  onCancel={cancelEdit}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  saving={status.saving}
                  deletingId={status.deletingId}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

function Summary({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function EditorialItem({
  type,
  item,
  editing,
  form,
  setForm,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  saving,
  deletingId,
}) {
  const id = getItemId(item);
  const isEditing = editing?.type === type && editing?.id === id;
  const imageUrl = getImageUrl(item);

  return (
    <li className="rounded-2xl border border-slate-200 p-4 transition hover:border-amber-200 hover:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={getTitle(type, item)}
            className="h-28 w-full rounded-xl object-cover sm:w-36"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            ID: {id || "N/A"}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{getTitle(type, item)}</h3>
          <p className="mt-2 text-sm text-slate-500">
            {getPreview(getDescription(type, item))}
          </p>
          {type === "offerings" && (
            <p className="mt-2 text-sm font-semibold text-amber-700">
              Price: {item.price ?? "Not provided"}
            </p>
          )}
        </div>
      </div>

      {isEditing ? (
        <EditForm
          type={type}
          form={form}
          setForm={setForm}
          onCancel={onCancel}
          onSave={() => onSave(type, item)}
          saving={saving}
        />
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit(type, item)}
            className="rounded-xl bg-[#0b1d3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132b52]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(type, item)}
            disabled={deletingId === id}
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deletingId === id ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </li>
  );
}

function EditForm({ type, form, setForm, onCancel, onSave, saving }) {
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
      {type === "blogs" && (
        <div className="grid gap-3">
          <Field
            label="Title"
            value={form.title}
            onChange={(value) => updateField("title", value)}
          />
          <TextArea
            label="Content"
            value={form.content}
            onChange={(value) => updateField("content", value)}
          />
          <FileField label="Image" onChange={(file) => updateField("image", file)} />
        </div>
      )}

      {type === "hiddenGems" && (
        <div className="grid gap-3">
          <Field
            label="PlaceName"
            value={form.PlaceName}
            onChange={(value) => updateField("PlaceName", value)}
          />
          <TextArea
            label="Description"
            value={form.Description}
            onChange={(value) => updateField("Description", value)}
          />
        </div>
      )}

      {type === "offerings" && (
        <div className="grid gap-3">
          <Field
            label="Title"
            value={form.title}
            onChange={(value) => updateField("title", value)}
          />
          <Field
            label="City"
            value={form.city}
            onChange={(value) => updateField("city", value)}
          />
          <TextArea
            label="Description"
            value={form.description}
            onChange={(value) => updateField("description", value)}
          />
          <Field
            label="Price"
            type="number"
            value={form.price}
            onChange={(value) => updateField("price", value)}
          />
          <Field
            label="Reviews"
            value={form.reviews}
            onChange={(value) => updateField("reviews", value)}
          />
          <FileField label="Replacement image" onChange={(file) => updateField("image", file)} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-xl bg-[#0b1d3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132b52] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-slate-700">
      {label}
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
      />
    </label>
  );
}

function FileField({ label, onChange }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-slate-700">
      {label}
      <input
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-slate-600 hover:file:bg-slate-200"
      />
    </label>
  );
}

export async function getServerSideProps(context) {
  const adminSession = await requireAdmin(context);
  if (adminSession.redirect) return adminSession;

  try {
    const [blogs, hiddenGems, offerings] = await Promise.all([
      getBlogs(adminSession.cookie),
      getHiddenGems(adminSession.cookie),
      getOfferings(adminSession.cookie),
    ]);

    return {
      props: {
        admin: adminSession.admin,
        initialBlogs: blogs,
        initialHiddenGems: hiddenGems,
        initialOfferings: offerings,
        initialError: "",
      },
    };
  } catch (error) {
    console.error("Editorial data error:", error.message);
    return {
      props: {
        admin: adminSession.admin,
        initialBlogs: [],
        initialHiddenGems: [],
        initialOfferings: [],
        initialError: error.message || "Editorial data could not be loaded.",
      },
    };
  }
}
