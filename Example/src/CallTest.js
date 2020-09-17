import React, { useMemo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Value,
  set,
  call,
  cond,
  block,
  Clock,
  startClock,
  clockRunning,
  onChange,
  timing,
  Easing,
} from 'react-native-reanimated';

const DURATION_SPIN_IN_MILLISECOND = 500;
const FRAME_NUMBER = 7;

let syncedPosition = 0;
let syncedTime = 0;
let syncedFrameTime = 0;

function useRotationFrame() {
  const clock = useMemo(() => new Clock(), []);
  const currentFrame = useMemo(() => {
    const state = {
      finished: new Value(0),
      position: new Value(syncedPosition),
      time: new Value(syncedTime),
      frameTime: new Value(syncedFrameTime),
    };
    const config = {
      duration: DURATION_SPIN_IN_MILLISECOND,
      toValue: new Value(FRAME_NUMBER - 1),
      easing: Easing.linear,
    };
    return block([
      cond(
        clockRunning(clock),
        [
          onChange(
            state.position,
            call(
              [state.position, state.time, state.frameTime],
              ([position, time, frameTime]) => {
                syncedPosition = position;
                syncedTime = time;
                syncedFrameTime = frameTime;
              }
            )
          ),
        ],
        [startClock(clock)]
      ),
      timing(clock, state, config),
      cond(state.finished, [
        set(state.finished, 0),
        set(state.position, 0),
        set(state.time, 0),
        set(state.frameTime, 0),
      ]),
      state.position,
    ]);
  }, []);

  return {
    left: currentFrame,
  };
}

function CallTest({ navigation }) {
  const { left } = useRotationFrame();

  useEffect(() => {
    navigation.navigate('Reanimated1');
  }, []);

  return (
    <View style={{ flex: 1, margin: 50 }}>
      <Animated.View
        style={{
          position: 'absolute',
          left: left,
        }}
      />
    </View>
  );
}

export default CallTest;
