/**
 * Phone — mobile device frame with notch and tall screen.
 * Full border-radius so it looks complete when lifted.
 */
import ScreenContainer from './ScreenContainer';
import { PhoneIcon } from './DeviceIcons';

export default function Phone() {
  return (
    <div className="phone w-full bg-[#1c1c26] rounded-[18px] border-[3px] border-[#2e2e40] overflow-hidden shadow-[-8px_5px_24px_rgba(0,0,0,.6)]">
      {/* Notch */}
      <div className="phone-notch h-[10px] bg-[#111118] flex items-center justify-center" />
      {/* Screen area */}
      <div className="phone-screen w-full aspect-[9/17] bg-[#1a1a24] overflow-hidden relative">
        <ScreenContainer label="Phone&#10;screenshot" icon={<PhoneIcon />} />
      </div>
    </div>
  );
}
