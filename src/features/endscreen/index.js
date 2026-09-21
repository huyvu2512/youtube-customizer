// QUẢN LÝ ẨN THẺ KẾT THÚC (ENDSCREEN) & CHÚ THÍCH (CARDS)
import { currentConfig } from '../../config/index.js';

export function isEndscreenHidden() {
    return !!currentConfig.hideEndscreen;
}
