(() => {
  const chkEnabled = document.getElementById('chk-enabled');
  const chkMasthead = document.getElementById('chk-masthead');
  const rangeSpread = document.getElementById('range-spread');
  const rangeBlur = document.getElementById('range-blur');
  const rangeSaturate = document.getElementById('range-saturate');
  const rangeBrightness = document.getElementById('range-brightness');

  const valSpread = document.getElementById('val-spread');
  const valBlur = document.getElementById('val-blur');
  const valSaturate = document.getElementById('val-saturate');
  const valBrightness = document.getElementById('val-brightness');

  const defaultConfig = {
    enabled: true,
    spread: 155,
    blur: 34,
    saturate: 145,
    brightness: 110,
    transparentMasthead: true
  };

  function updateUi(cfg) {
    chkEnabled.checked = !!cfg.enabled;
    chkMasthead.checked = !!cfg.transparentMasthead;
    rangeSpread.value = cfg.spread;
    valSpread.textContent = `${cfg.spread}%`;
    rangeBlur.value = cfg.blur;
    valBlur.textContent = `${cfg.blur}px`;
    rangeSaturate.value = cfg.saturate;
    valSaturate.textContent = `${cfg.saturate}%`;
    rangeBrightness.value = cfg.brightness;
    valBrightness.textContent = `${cfg.brightness}%`;
  }

  function saveConfig() {
    const cfg = {
      enabled: chkEnabled.checked,
      transparentMasthead: chkMasthead.checked,
      spread: parseInt(rangeSpread.value, 10),
      blur: parseInt(rangeBlur.value, 10),
      saturate: parseInt(rangeSaturate.value, 10),
      brightness: parseInt(rangeBrightness.value, 10)
    };
    chrome.storage.local.set({ ytc_ambilight_config: cfg });
  }

  chrome.storage.local.get(['ytc_ambilight_config'], (res) => {
    const cfg = Object.assign({}, defaultConfig, res && res.ytc_ambilight_config);
    updateUi(cfg);
  });

  chkEnabled.addEventListener('change', saveConfig);
  chkMasthead.addEventListener('change', saveConfig);

  rangeSpread.addEventListener('input', () => {
    valSpread.textContent = `${rangeSpread.value}%`;
    saveConfig();
  });

  rangeBlur.addEventListener('input', () => {
    valBlur.textContent = `${rangeBlur.value}px`;
    saveConfig();
  });

  rangeSaturate.addEventListener('input', () => {
    valSaturate.textContent = `${rangeSaturate.value}%`;
    saveConfig();
  });

  rangeBrightness.addEventListener('input', () => {
    valBrightness.textContent = `${rangeBrightness.value}%`;
    saveConfig();
  });
})();
