"use client";

import { useEffect, useState } from "react";
import { VeltCommentTool } from "@veltdev/react";
import { KebabIcon } from "./icons";

// Static Altana-style product review table (host DOM, not Velt)

type ReviewKey = "flag" | "ai" | "pending" | "done" | "todo";

interface Product {
  id: string;
  name: string;
  code: string;
  status: "Needs Review" | "Ready";
  review: Partial<Record<ReviewKey, number>>;
  organization: string;
  hsCode: string;
  updated: string;
}

const products: Product[] = [
  {
    id: "denim-jean-patches",
    name: "Denim Jean Patches",
    code: "ALTA-NA00-0000",
    status: "Needs Review",
    review: { flag: 2, ai: 1, pending: 1, done: 2, todo: 3 },
    organization: "Thread Haven",
    hsCode: "5810.92.1000",
    updated: "4 days ago",
  },
  {
    id: "seersucker-button-down",
    name: "Seersucker Button-Down",
    code: "ALTA-0089-1199",
    status: "Needs Review",
    review: { ai: 1, done: 5, todo: 3 },
    organization: "Thread Haven",
    hsCode: "6205.20.0090",
    updated: "4 days ago",
  },
  {
    id: "short-sleeve-camp-shirt",
    name: "Short Sleeve Camp Shirt",
    code: "ALTA-0000-0000",
    status: "Needs Review",
    review: { flag: 2, ai: 2, done: 2, todo: 3 },
    organization: "Thread Haven",
    hsCode: "6205.20.0090",
    updated: "5 days ago",
  },
  {
    id: "lightweight-denim-shirt",
    name: "Lightweight Denim Shirt",
    code: "ALTA-0000-0000",
    status: "Ready",
    review: { todo: 9 },
    organization: "Thread Haven",
    hsCode: "6205.20.2050",
    updated: "6 days ago",
  },
  {
    id: "pima-cotton-polo",
    name: "Pima Cotton Polo",
    code: "ALTA-0000-0000",
    status: "Needs Review",
    review: { flag: 2, done: 4, todo: 3 },
    organization: "Thread Haven",
    hsCode: "6109.10.0012",
    updated: "7 days ago",
  },
  {
    id: "breton-stripe-tee",
    name: "Breton Stripe Tee",
    code: "ALTA-0000-0000",
    status: "Ready",
    review: { done: 6, todo: 3 },
    organization: "Thread Haven",
    hsCode: "6109.10.0012",
    updated: "11 days ago",
  },
  {
    id: "linen-blend-shirt",
    name: "Linen Blend Shirt",
    code: "ALTA-0000-0000",
    status: "Needs Review",
    review: { flag: 1, ai: 1, done: 4, todo: 3 },
    organization: "Thread Haven",
    hsCode: "6205.20.0090",
    updated: "14 days ago",
  },
];

// Order matters: pills render left-to-right in this sequence, skipping zeros
const reviewOrder: ReviewKey[] = ["flag", "ai", "pending", "done", "todo"];

const reviewIcons: Record<ReviewKey, React.ReactNode> = {
  flag: (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <path d="M6 1.4 11 10.4H1z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M6 4.9v2.4M6 8.7v.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <path d="M6 1 7.1 4.9 11 6 7.1 7.1 6 11 4.9 7.1 1 6l3.9-1.1z" fill="currentColor" />
    </svg>
  ),
  pending: (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <circle cx="6" cy="6" r="4.7" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M6 3.4V6l1.8 1.1" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  done: (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <circle cx="6" cy="6" r="4.7" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="m3.9 6.1 1.5 1.5 2.7-3" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  todo: (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <circle
        cx="6"
        cy="6"
        r="4.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeDasharray="1.6 1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// [Velt] Popover comments live on the Name cell
const cellId = (productId: string) => `product-name-${productId}`;

export function ProductsTable() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Dismiss the kebab dropdown on outside click or Escape
  useEffect(() => {
    if (!openMenu) return;
    // Capture phase, so the "inside the menu?" test runs before any other handler
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".hv-cell-menu")) setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  return (
    <section className="hv-table-card" aria-label="Product passport review">
      <table className="hv-table">
        <thead>
          <tr>
            <th className="hv-table-check">
              <input type="checkbox" aria-label="Select all products" />
            </th>
            <th>Name</th>
            <th>Status</th>
            <th>Passport Review</th>
            <th>Organization</th>
            <th>HS Code</th>
            <th>Last updated</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="hv-table-check">
                <input type="checkbox" aria-label={`Select ${product.name}`} />
              </td>
              <td className="hv-cell-commentable" id={cellId(product.id)}>
                <div className="hv-table-name">{product.name}</div>
                <div className="hv-table-code">
                  <span className="hv-table-code-dot" />
                  {product.code}
                </div>
                <div
                  className={`hv-cell-menu${openMenu === product.id ? " hv-cell-menu--open" : ""}`}
                >
                  <button
                    type="button"
                    className={`hv-cell-menu-trigger${openMenu === product.id ? " hv-cell-menu-trigger--open" : ""}`}
                    aria-label={`Actions for ${product.name}`}
                    aria-expanded={openMenu === product.id}
                    onClick={() =>
                      setOpenMenu((current) => (current === product.id ? null : product.id))
                    }
                  >
                    <KebabIcon />
                  </button>
                  {/* Hidden with CSS rather than unmounted, to keep Velt's tool alive */}
                  {/* onClickCapture on the CONTAINER, not `onClick` on the tool */}
                  <div
                    className="hv-cell-dropdown"
                    role="menu"
                    style={{ display: openMenu === product.id ? "block" : "none" }}
                    onClickCapture={() => setOpenMenu(null)}
                  >
                    {/* Rendered by VeltCommentToolWf as an "Add comment" row.
                        `context` lands on the annotation, which is what fills the
                        card's "Product Name" row. */}
                    <VeltCommentTool
                      targetElementId={cellId(product.id)}
                      context={{ productName: product.name }}
                    />
                  </div>
                </div>
              </td>
              <td>
                <span
                  className={`hv-status hv-status--${product.status === "Ready" ? "ready" : "review"}`}
                >
                  {product.status}
                </span>
              </td>
              <td>
                <div className="hv-review">
                  {reviewOrder.map((key) => {
                    const count = product.review[key];
                    if (!count) return null;
                    return (
                      <span key={key} className={`hv-review-pill hv-review-pill--${key}`}>
                        {reviewIcons[key]}
                        {count}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td>{product.organization}</td>
              <td className="hv-table-mono">{product.hsCode}</td>
              <td className="hv-table-muted">{product.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ProductsTable;
