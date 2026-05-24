/**
 * Ipad — tablet device with top bar and screen.
 * Full border-radius so it looks complete even when lifted off the bottom edge.
 */
import ScreenContainer from './ScreenContainer';
import { TabletIcon } from './DeviceIcons';

export default function Ipad() {
  return (
    <div className="ipad w-full bg-[#1c1c26] rounded-[14px] border-[3px] border-[#2e2e40] overflow-hidden shadow-[-10px_5px_32px_rgba(0,0,0,.55)]">
      {/* Top speaker bar */}
      <div className="ipad-bar h-[10px] bg-[#111118] flex items-center justify-center" />
      {/* Screen area */}
      <div className="ipad-screen w-full aspect-[4/5.5] bg-[#1a1a24] overflow-hidden relative">
        <ScreenContainer label="iPad&#10;screenshot" icon={<TabletIcon />} />
      </div>
    </div>
  );
}
