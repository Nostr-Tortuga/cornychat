import React, {useState} from 'react';
import {Modal} from '../Modal';
import {rawTimeZones} from '@vvo/tzdb';
import {useJam} from '../../jam-core-react';
import {colorThemes, isDark} from '../../lib/theme';
import {BasicRoomInfo} from './BasicRoomInfo';
import {DesignRoomInfo} from './DesignRoomInfo';
import {ExtraRoomInfo} from './ExtraRoomInfo';
import {RoomModerators} from './RoomModerators';
import {Links} from './Links';
import {Slides} from './Slides';
import {CustomEmojis} from './CustomEmojis';
import {getCustomColor, getRgbaObj, getColorPallete} from './utils';
import {use} from 'use-minimal-state';

export function EditRoomModal({roomId, room, roomColor, close}) {
  const [state, {updateRoom}] = useJam();

  let submitUpdate = async partialRoom => {
    updateRoom(roomId, {...room, ...partialRoom});
  };

  const textColor = isDark(roomColor.buttons.primary)
    ? roomColor.text.light
    : roomColor.text.dark;

  const [showAdvanced, setShowAdvanced] = useState(
    !!(room.logoURI || room.color)
  );

  //const [state] = useJam();
  let [myId] = use(state, ['myId']);
  const isAdmin = (myId == 'N0NUR5mmNAMuoif5eR_hoovEKuaTl_KhJyYcskU9QY4');

  let [name, setName] = useState(room.name || '');
  let [description, setDescription] = useState(room.description || '');
  let [color, setColor] = useState(room?.color ?? 'default');
  let [logoURI, setLogoURI] = useState(room.logoURI || '');
  let [backgroundURI, setBackgroundURI] = useState(room.backgroundURI || '');
  let [roomLinks, setRoomLinks] = useState(room.roomLinks || []);
  let [moderators, setModerators] = useState(room.moderators || []);
  let [closed, setClosed] = useState(room.closed || false);
  let [isPrivate, setIsPrivate] = useState(room.isPrivate || false);
  let [isRecordingAllowed, setIsRecordingAllowed] = useState(room.isRecordingAllowed || false);
  let [stageOnly, setStageOnly] = useState(room.stageOnly || false);
  let [customEmojis, setCustomEmojis] = useState(room.customEmojis);
  let [roomSlides, setRoomSlides] = useState(room.roomSlides || []);

  let [schedule, setSchedule] = useState(room.schedule);
  let [scheduleCandidate, setScheduleCandidate] = useState({
    date: `${new Date().toISOString().split('T')[0]}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  let [showTimezoneSelect, setShowTimezoneSelect] = useState(false);
  let [showRepeatSelect, setShowRepeatSelect] = useState(false);

  let [colorPickerBg, setColorPickerBg] = useState(false);
  let [colorPickerAvatar, setColorPickerAvatar] = useState(false);
  let [colorPickerButton, setColorPickerButton] = useState(false);
  let [customBg, setCustomBg] = useState(
    getRgbaObj(room.customColor?.background ?? 'rbga(255,255,255,1)')
  );
  let [customAvatar, setCustomAvatar] = useState(
    getRgbaObj(room.customColor?.avatarBg ?? 'rgba(21,21,192,1)')
  );
  let [customButtons, setCustomButtons] = useState(
    getRgbaObj(room.customColor?.buttons.primary ?? 'rgba(192,192,21,1)')
  );

  let styleBg = `rgba(${customBg.r},${customBg.g},${customBg.b},${customBg.a})`;
  let styleAvatar = `rgba(${customAvatar.r},${customAvatar.g},${customAvatar.b},${customAvatar.a})`;
  let styleButtons = `rgba(${customButtons.r},${customButtons.g},${customButtons.b},${customButtons.a})`;

  let customColor = getCustomColor(styleBg, styleAvatar, styleButtons);

  let paletteColors = getColorPallete({
    ...colorThemes,
    customColor,
  });

  const [tooltipStates, setTooltipStates] = useState(
    paletteColors?.map(() => false) ?? false
  );

  let completeSchedule = () => {
    return scheduleCandidate?.date && scheduleCandidate?.time;
  };

  let handleScheduleChange = e => {
    setScheduleCandidate({
      ...scheduleCandidate,
      [e.target.name]: e.target.value,
    });
    console.log(scheduleCandidate);
  };

  let removeSchedule = e => {
    e.preventDefault();
    setSchedule(undefined);
    let schedule = undefined;

    submitUpdate({schedule});
  };

  let submitSchedule = e => {
    e.preventDefault();
    if (scheduleCandidate) {
      let schedule = scheduleCandidate;
      setSchedule(scheduleCandidate);
      submitUpdate({schedule});
    }
  };

  let submit = async e => {
    e.preventDefault();

    name = name.replace('&amp','&');
    description = description.replace('&amp','&');

    await submitUpdate({
      name,
      description,
      color,
      customColor,
      logoURI,
      backgroundURI,
      roomLinks,
      customEmojis,
      closed,
      isPrivate,
      isRecordingAllowed,
      stageOnly,
      moderators,
      roomSlides,
    });
    close();
  };

  return (
    <Modal close={close}>
      <h1>Room Settings</h1>
      <div className="p-4 py-8 bg-gray-100 rounded-lg my-3">
        <BasicRoomInfo
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          logoURI={logoURI}
          setLogoURI={setLogoURI}
          closed={closed}
          setClosed={setClosed}
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
          isRecordingAllowed={isRecordingAllowed}
          setIsRecordingAllowed={setIsRecordingAllowed}
          stageOnly={stageOnly}
          setStageOnly={setStageOnly}
        />
      </div>

      <div className="p-4 py-8 bg-gray-100 rounded-lg my-3">
        <DesignRoomInfo
          backgroundURI={backgroundURI}
          setBackgroundURI={setBackgroundURI}
          paletteColors={paletteColors}
          color={color}
          setColor={setColor}
          colorPickerBg={colorPickerBg}
          colorPickerAvatar={colorPickerAvatar}
          colorPickerButton={colorPickerButton}
          setColorPickerBg={setColorPickerBg}
          setColorPickerAvatar={setColorPickerAvatar}
          setColorPickerButton={setColorPickerButton}
          customBg={customBg}
          setCustomBg={setCustomBg}
          customAvatar={customAvatar}
          setCustomAvatar={setCustomAvatar}
          customButtons={customButtons}
          setCustomButtons={setCustomButtons}
          styleBg={styleBg}
          styleAvatar={styleAvatar}
          styleButtons={styleButtons}
          tooltipStates={tooltipStates}
          setTooltipStates={setTooltipStates}
        />
      </div>

      <div className="px-4 py-8 bg-gray-100 rounded-lg my-3">
        <Links
          roomLinks={roomLinks}
          setRoomLinks={setRoomLinks}
          textColor={textColor}
          roomColor={roomColor}
        />
      </div>

      <div className="px-4 py-8 bg-gray-100 rounded-lg my-3">
        <Slides
          roomSlides={roomSlides}
          setRoomSlides={setRoomSlides}
          textColor={textColor}
          roomColor={roomColor}
        />
      </div>

      <div className="px-4 py-8 bg-gray-100 rounded-lg my-3">
        <CustomEmojis
          customEmojis={customEmojis}
          setCustomEmojis={setCustomEmojis}
          textColor={textColor}
          roomColor={roomColor}
        />
      </div>

      <div className="px-4 py-8 bg-gray-100 rounded-lg my-3 hidden">
        <RoomModerators
          moderators={moderators}
          setModerators={setModerators}
          textColor={textColor}
          roomColor={roomColor}
        />
      </div>


      <div>
        <div className="flex items-center absolute w-full" style={{
            bottom: '96px', zIndex: '5'
          }}>
          <button
            onClick={submit}
            className="h-12 px-4 w-3/5 text-md rounded-lg mr-2"
            style={{
              color: textColor,
              backgroundColor: roomColor.buttons.primary,
            }}
          >
            Update Room
          </button>
          <button
            onClick={close}
            className="h-12 px-4 w-1/4 text-md text-black bg-gray-100 rounded-lg focus:shadow-outline active:bg-gray-300"
          >
            Cancel
          </button>
        </div>

      <div className="px-4 py-8 bg-gray-100 rounded-lg my-3 hidden">
        <form>
          <div className="pb-1">🗓 Room Schedule (experimental)</div>
          <div className="pb-3 text-gray-500">
            Set the date and time for an upcoming event.
          </div>

          <div className={schedule ? 'hidden' : 'w-full'}>
            <div className="flex">
              <input
                type="date"
                className="flex-grow p-2 border rounded"
                name="date"
                placeholder="yyyy-mm-dd"
                min={`${
                  new Date(new Date() - 86400000).toISOString().split('T')[0]
                }`}
                value={
                  scheduleCandidate?.date ||
                  `${new Date().toISOString().split('T')[0]}`
                }
                onChange={handleScheduleChange}
              />
              <input
                type="time"
                className="flex-none ml-3 p-2 border rounded"
                name="time"
                placeholder="hh:mm"
                value={scheduleCandidate?.time || ''}
                onChange={handleScheduleChange}
              />
            </div>
            <div
              className={
                showTimezoneSelect ? 'hidden' : 'p-2 pt-4 text-gray-500'
              }
            >
              {scheduleCandidate.timezone}{' '}
              <span
                className="underline"
                onClick={() => setShowTimezoneSelect(true)}
              >
                change
              </span>
            </div>
            <select
              name="timezone"
              defaultValue={scheduleCandidate.timezone}
              onChange={handleScheduleChange}
              className={
                showTimezoneSelect ? 'w-full border mt-3 p-2 rounded' : 'hidden'
              }
            >
              {rawTimeZones.map(tz => {
                return (
                  <option key={tz.rawFormat} value={tz.name}>
                    {tz.rawFormat}
                  </option>
                );
              })}
            </select>

            <div className={showRepeatSelect ? 'hidden' : 'p-2 text-gray-500'}>
              <span
                className="underline"
                onClick={() => setShowRepeatSelect(true)}
              >
                repeat?
              </span>
            </div>
            <select
              name="repeat"
              defaultValue="never"
              onChange={handleScheduleChange}
              className={
                showRepeatSelect ? 'border mt-3 p-2 rounded' : 'hidden'
              }
            >
              {['never', 'weekly', 'monthly'].map(rep => {
                return (
                  <option key={rep} value={rep}>
                    {rep}
                  </option>
                );
              })}
            </select>
          </div>

          <div
            className={schedule ? 'rounded bg-gray-50 border w-full' : 'hidden'}
          >
            <div className="text-gray-500 p-3">
              {schedule?.date} at {schedule?.time}
              <br />
              {schedule?.timezone}
              <br />
              {schedule?.repeat == 'weekly' || schedule?.repeat == 'monthly'
                ? schedule?.repeat
                : ''}
            </div>
            <div className={schedule ? 'p-3 text-gray-500' : 'hidden'}>
              <span onClick={removeSchedule} className="underline">
                Remove schedule
              </span>
            </div>
          </div>

          <div className={!schedule && completeSchedule() ? 'flex' : 'hidden'}>
            <button
              onClick={submitSchedule}
              className="flex-grow mt-5 h-12 px-6 text-lg bg-gray-600 rounded-lg mr-2"
              style={{
                color: textColor,
                backgroundColor: roomColor.buttons.primary,
              }}
            >
              Set Schedule
            </button>
          </div>
        </form>
      </div>

        <div className="h-28"></div>
      </div>
    </Modal>
  );
}
