/* ============================================
   Theme E: レトロ大衆居酒屋 — 赤提灯風
   呑み処 穂乃家（ほのか） - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- ナビゲーション ---
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // スクロールでナビバー背景変更
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ハンバーガーメニュー開閉
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
    navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ナビメニューリンククリックで閉じる
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });

  // メニュー外クリックで閉じる
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });

  // --- スクロールアニメーション（Intersection Observer） ---
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => {
      fadeObserver.observe(el);
    });
  } else {
    // Intersection Observer非対応ブラウザ向けフォールバック
    fadeElements.forEach(el => {
      el.classList.add('is-visible');
    });
  }

  // --- 短冊のランダム角度 ---
  const tanzakuItems = document.querySelectorAll('.tanzaku');
  tanzakuItems.forEach(tanzaku => {
    const randomAngle = (Math.random() - 0.5) * 4; // -2 ~ +2度
    const randomY = Math.random() * 6; // 0 ~ 6px
    tanzaku.style.transform = `rotate(${randomAngle}deg) translateY(${randomY}px)`;

    // ホバー時のアニメーション用に初期角度を保存
    tanzaku.dataset.angle = randomAngle;
    tanzaku.dataset.offsetY = randomY;

    tanzaku.addEventListener('mouseenter', () => {
      tanzaku.style.transform = `rotate(${randomAngle - 2}deg) translateY(-4px)`;
      tanzaku.style.boxShadow = '4px 6px 16px rgba(0, 0, 0, 0.5)';
    });

    tanzaku.addEventListener('mouseleave', () => {
      tanzaku.style.transform = `rotate(${randomAngle}deg) translateY(${randomY}px)`;
      tanzaku.style.boxShadow = '2px 3px 10px rgba(0, 0, 0, 0.4)';
    });
  });

  // --- スムーススクロール ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });

  // --- 提灯の揺れにランダム性を追加 ---
  const lanterns = document.querySelectorAll('.lantern');
  lanterns.forEach((lantern, i) => {
    const baseDelay = i * 0.7;
    const randomDelay = Math.random() * 0.5;
    lantern.style.animationDelay = `${baseDelay + randomDelay}s`;
  });

  // --- 固定CTAボタン表示制御 ---
  const fixedCta = document.querySelector('.fixed-cta');
  if (fixedCta) {
    let lastScroll = 0;
    let ctaVisible = true;

    const handleCtaVisibility = () => {
      const currentScroll = window.scrollY;
      const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;

      // Heroセクション内では非表示
      if (currentScroll < heroHeight * 0.7) {
        if (ctaVisible) {
          fixedCta.style.transform = 'translateY(100px)';
          fixedCta.style.opacity = '0';
          fixedCta.style.pointerEvents = 'none';
          ctaVisible = false;
        }
      } else {
        if (!ctaVisible) {
          fixedCta.style.transform = 'translateY(0)';
          fixedCta.style.opacity = '1';
          fixedCta.style.pointerEvents = 'auto';
          ctaVisible = true;
        }
      }

      lastScroll = currentScroll;
    };

    // 初期スタイル
    fixedCta.style.transition = 'transform 0.4s ease, opacity 0.4s ease, box-shadow 0.3s ease';
    fixedCta.style.transform = 'translateY(100px)';
    fixedCta.style.opacity = '0';
    fixedCta.style.pointerEvents = 'none';

    window.addEventListener('scroll', handleCtaVisibility, { passive: true });
    handleCtaVisibility();
  }

  // --- のれんホバーアニメーション ---
  const norenPieces = document.querySelectorAll('.noren-piece');
  norenPieces.forEach((piece, i) => {
    piece.style.animationDelay = `${i * 0.15}s`;
  });

  // --- パララックス風エフェクト（軽量版） ---
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && window.matchMedia('(min-width: 769px)').matches) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;

          if (scrolled < heroHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // 初期スケール
    heroBg.style.transform = 'scale(1.1)';
    heroBg.style.transition = 'none';
  }
});
