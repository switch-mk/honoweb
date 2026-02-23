/* ============================================
   Selector Page — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Add hover sound/visual feedback
  const cards = document.querySelectorAll('.theme-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '1';
    });
  });
});
