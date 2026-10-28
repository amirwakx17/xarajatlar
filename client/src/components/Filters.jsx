export default function Filters({ filters, categories, onChange }) {
  const visibleCategories = filters.type
    ? categories.filter((category) => category.kind === filters.type)
    : categories;
  const isActive =
    filters.type || filters.categoryId || filters.month || filters.sort !== "date_desc";

  function update(patch) {
    const next = { ...filters, ...patch };
    if (patch.type !== undefined && next.categoryId) {
      const category = categories.find((item) => String(item.id) === String(next.categoryId));
      if (!category || category.kind !== next.type) next.categoryId = "";
    }
    onChange(next);
  }

  return (
    <div className="filters">
      <label className="field">
        <span>Tur</span>
        <select value={filters.type} onChange={(event) => update({ type: event.target.value })}>
          <option value="">Barchasi</option>
          <option value="income">Kirim</option>
          <option value="expense">Chiqim</option>
        </select>
      </label>

      <label className="field">
        <span>Kategoriya</span>
        <select value={filters.categoryId} onChange={(event) => update({ categoryId: event.target.value })}>
          <option value="">Barchasi</option>
          {visibleCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Oy</span>
        <input
          type="month"
          value={filters.month}
          onChange={(event) => update({ month: event.target.value })}
        />
      </label>

      <label className="field">
        <span>Saralash</span>
        <select value={filters.sort} onChange={(event) => update({ sort: event.target.value })}>
          <option value="date_desc">Sana: yangidan eskiga</option>
          <option value="date_asc">Sana: eskidan yangiga</option>
          <option value="amount_desc">Summa: kattadan kichikka</option>
          <option value="amount_asc">Summa: kichikdan kattaga</option>
        </select>
      </label>

      {isActive && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => onChange({ type: "", categoryId: "", month: "", sort: "date_desc" })}
        >
          Tozalash
        </button>
      )}
    </div>
  );
}
