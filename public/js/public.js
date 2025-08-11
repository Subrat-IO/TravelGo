// ======================filter switch js================//

const filters = document.getElementById('filters');
  const btnLeft = document.getElementById('scroll-left');
  const btnRight = document.getElementById('scroll-right');
  const scrollAmount = 200;

  function scrollRightLoop() {
    if (filters.scrollLeft + filters.clientWidth >= filters.scrollWidth - 5) {
      filters.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      filters.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function scrollLeftLoop() {
    if (filters.scrollLeft <= 0) {
      filters.scrollTo({ left: filters.scrollWidth, behavior: 'smooth' });
    } else {
      filters.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  btnRight.addEventListener('click', scrollRightLoop);
  btnLeft.addEventListener('click', scrollLeftLoop);

  // Tax Toggle Logic
  const taxSwitch = document.getElementById('tax-toggle');
  const priceTags = document.querySelectorAll('.price-tag');
  const taxInfos = document.querySelectorAll('.tax-info');
  const switchLabel = document.querySelector('.switch-label');
  const TAX_RATE = 0.18; // 18%

  function updatePrices() {
    priceTags.forEach((tag, idx) => {
      const basePrice = parseFloat(tag.dataset.price);
      if (taxSwitch.checked) {
        const gstAmount = basePrice * TAX_RATE;
        const totalPrice = basePrice + gstAmount;
        tag.textContent = `₹${Math.round(totalPrice).toLocaleString("en-IN")}`;
        switchLabel.textContent = "Showing After Tax";
        taxInfos[idx].textContent = `(Includes ₹${Math.round(gstAmount).toLocaleString("en-IN")} GST)`;
      } else {
        tag.textContent = `₹${Math.round(basePrice).toLocaleString("en-IN")}`;
        switchLabel.textContent = "Showing Before Tax";
        taxInfos[idx].textContent = `(+ 18% GST)`;
      }
    });
  }

  taxSwitch.addEventListener('change', updatePrices);

  // Auto-update on page load
  document.addEventListener('DOMContentLoaded', updatePrices);
