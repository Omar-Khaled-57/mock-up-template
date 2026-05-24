/**
 * Monitor — desktop monitor device frame with traffic-light bar, screen,
 * stand, and base. Screen content handled by ScreenContainer.
 */
import ScreenContainer from './ScreenContainer';
import { MonitorIcon } from './DeviceIcons';

export default function Monitor() {
  return (
    <div className="monitor flex flex-col items-center w-full">
      {/* Monitor body */}
      <div className="monitor-body w-full bg-[#1c1c26] rounded-[10px] border-[3px] border-[#2e2e40] overflow-hidden shadow-[-16px_10px_50px_rgba(0,0,0,.55),_10px_10px_40px_rgba(0,0,0,.4)]">
        {/* Traffic-light bar */}
        <div className="monitor-bar h-[14px] bg-[#111118] flex items-center px-[10px] gap-[5px] shrink-0">
          <span className="w-[7px] h-[7px] rounded-full inline-block" />
          <span className="w-[7px] h-[7px] rounded-full inline-block" />
          <span className="w-[7px] h-[7px] rounded-full inline-block" />
        </div>
        {/* Screen area */}
        <div className="monitor-screen w-full aspect-[16/10] bg-[#1a1a24] overflow-hidden relative">
          <ScreenContainer label="PC / Desktop&#10;screenshot" icon={<MonitorIcon />} />
        </div>
      </div>
      {/* Stand */}
      <div className="w-[12%] h-[14px] bg-[#1c1c26] border-[3px] border-[#2e2e40] border-t-0 mx-auto" />
      {/* Base */}
      <div className="w-[22%] h-[5px] bg-[#1c1c26] border-x-[3px] border-b-[3px] border-[#2e2e40] rounded-b-[4px] mx-auto" />
    </div>
  );
}
