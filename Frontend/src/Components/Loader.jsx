import React from "react";

const ProductsPageSkeleton = () => {
  const skeletonStyle = {
    backgroundColor: "#e0e0e0",
    borderRadius: "8px",
    animation: "pulse 1.5s infinite",
  };

  const keyframes = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={{ padding: "20px" }}>
        {/* Banner skeleton */}
        <div
          style={{
            ...skeletonStyle,
            width: "100%",
            height: "200px",
            marginBottom: "20px",
          }}
        ></div>

        {/* Sidebar + Products */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Sidebar skeleton (30%) */}
          <div style={{ width: "30%" }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...skeletonStyle,
                  width: "100%",
                  height: "40px",
                  marginBottom: "12px",
                }}
              ></div>
            ))}
          </div>

          {/* Products grid (70%) */}
          <div
            style={{
              width: "70%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "15px",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    ...skeletonStyle,
                    width: "100%",
                    height: "150px",
                    marginBottom: "10px",
                  }}
                ></div>
                <div
                  style={{
                    ...skeletonStyle,
                    width: "80%",
                    height: "18px",
                    marginBottom: "8px",
                  }}
                ></div>
                <div
                  style={{
                    ...skeletonStyle,
                    width: "40%",
                    height: "16px",
                    marginBottom: "8px",
                  }}
                ></div>
                <div
                  style={{
                    ...skeletonStyle,
                    width: "60%",
                    height: "30px",
                    borderRadius: "6px",
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPageSkeleton;
