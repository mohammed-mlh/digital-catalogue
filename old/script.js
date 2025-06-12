let currentCategory = "All";
let currentBrand = "All";
let currentModel = "All";
let currentSort = "name";

// Brand to Models mapping
const brandModels = {
  "Ford": ["Mustang", "Focus"],
  "Mercedes-Benz": ["G-Class"]
};

function updateModelSelect(brand) {
  const modelSelect = document.getElementById("modelSelect");
  modelSelect.innerHTML = '<option value="All">All Models</option>';
  
  if (brand !== "All" && brandModels[brand]) {
    brandModels[brand].forEach(model => {
      modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    });
  }
}

function handleBrandChange() {
  const brandSelect = document.getElementById("brandSelect");
  const selectedBrand = brandSelect.value;
  
  // Update model select options
  updateModelSelect(selectedBrand);
  
  // Update current brand and reset model
  currentBrand = selectedBrand;
  currentModel = "All";
  
  renderCatalog();
}

function handleModelChange() {
  const modelSelect = document.getElementById("modelSelect");
  currentModel = modelSelect.value;
  renderCatalog();
}

function handleSort() {
  const sortSelect = document.getElementById("sortSelect");
  currentSort = sortSelect.value;
  renderCatalog();
}

function showLoading() {
  document.getElementById("loadingState").classList.remove("hidden");
  document.getElementById("catalog").classList.add("hidden");
}

function hideLoading() {
  document.getElementById("loadingState").classList.add("hidden");
  document.getElementById("catalog").classList.remove("hidden");
}

function sortParts(parts) {
  return parts.sort((a, b) => {
    switch (currentSort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-asc":
        return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""));
      case "price-desc":
        return parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""));
      default:
        return 0;
    }
  });
}

function renderCatalog() {
  showLoading();
  
  // Simulate loading delay
  setTimeout(() => {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = "";

    const filtered = parts.filter(part =>
      (currentCategory === "All" || part.category === currentCategory) &&
      (currentBrand === "All" || part.brand === currentBrand) &&
      (currentModel === "All" || part.model === currentModel) &&
      (part.name.toLowerCase().includes(search) || 
       part.description.toLowerCase().includes(search) ||
       part.brand.toLowerCase().includes(search) ||
       part.model.toLowerCase().includes(search))
    );

    // Sort the filtered results
    const sortedParts = sortParts(filtered);

    // Update results count
    const resultsCount = document.getElementById("resultsCount");
    resultsCount.textContent = `${sortedParts.length} part${sortedParts.length !== 1 ? 's' : ''} found`;

    if (sortedParts.length === 0) {
      catalog.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-500 text-lg">No parts found</p>
          <p class="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
        </div>`;
      hideLoading();
      return;
    }

    sortedParts.forEach(part => {
      catalog.innerHTML += `
        <div class="bg-white -xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ">
          <img src="${part.image}" alt="${part.name}" class="w-full h-40 object-cover" />
          <div class="py-4 px-2">
            <h3 class="text-lg font-semibold text-gray-800">${part.name}</h3>
            <p class="text-xs text-gray-600 mt-1">${part.brand} ${part.model}</p>
            <div class="flex justify-between items-center mt-3">
              <span class="text-blue-600 font-bold">${part.price}</span>
              <button onclick="viewDetails(${part.id})" 
                class="text-sm bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>`;
    });

    hideLoading();
  }, 300); // Simulate loading delay
}

function filterCategory(category) {
  currentCategory = category;
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("bg-blue-500", "text-white");
    btn.classList.add("bg-gray-100");
  });
  event.target.classList.add("bg-blue-500", "text-white");
  event.target.classList.remove("bg-gray-100");
  renderCatalog();
}

function viewDetails(id) {
  const part = parts.find(p => p.id === id);
  if (!part) return;
  
  document.getElementById("modalTitle").textContent = part.name;
  document.getElementById("modalBrandModel").textContent = `${part.brand} ${part.model}`;
  document.getElementById("modalImage").src = part.image;
  document.getElementById("modalDescription").textContent = part.description;
  document.getElementById("modalPrice").textContent = part.price;
  
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  
  // Trigger reflow
  modalContent.offsetHeight;
  
  // Add show class for animation
  modalContent.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  
  // Remove show class first
  modalContent.classList.remove("show");
  
  // Wait for animation to complete before hiding
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }, 300);
}

// Close modal if clicked outside modal content
function closeOnBackdrop(event) {
  if (event.target.id === "modal") {
    closeModal();
  }
}

// Filter Drawer Functions
function toggleFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    const backdrop = document.getElementById('filterDrawerBackdrop');
    
    if (drawer.classList.contains('translate-x-full')) {
        // Open drawer
        drawer.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    } else {
        // Close drawer
        drawer.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }
}

function applyFilters() {
    renderCatalog();
    toggleFilterDrawer();
}

// Close drawer when clicking backdrop
document.getElementById('filterDrawerBackdrop').addEventListener('click', toggleFilterDrawer);

// Initialize the catalog when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
}); 