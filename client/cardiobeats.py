# Test of PyMyo - same functionality as hello-myo.exe
# Paul Lutz
# Scott Martin

from myo import Myo
import sys
import requests
import math

last_pose = None

last_pitches = []

last_times = []

# had_peak = None
prev_local_extrema = False

sign = lambda x: math.copysign(1, x)

last_extrema_high = None
last_extrema_low = None

def printData(myo):
  global last_pose
  global prev_local_extrema
  global last_extrema_low
  global last_extrema_high

  arm_str = myo.getArmString()
  
  pose_str = myo.getPoseString()
  
  # The clock does not act like an ordinary one since it updates its seconds faster.
  # This was done to maintain accuracy while keeping a small file size.
  time = myo.getTime()
  # You can also scale this to a certain value by using myo.getRotationScaled(value)[1] 
  pitch = myo.getRotation()[1] 

  last_pitches.append(pitch)
  last_times.append(time)
  if len(last_pitches) > 3:
    dump = last_pitches.pop(0)
    dump = last_times.pop(0)

    # print last_times
    # print last_pitches

    # print (last_times[1] - last_times[0])
    success = False
    try:
      slope1 = (last_pitches[1] - last_pitches[0])/(last_times[1] - last_times[0])
      slope2 = (last_pitches[2] - last_pitches[1])/(last_times[2] - last_times[1])
      success = True
    except ZeroDivisionError, e:
      print "Failed"
      # raise e
    # slope1 = (last_pitches[1] - last_pitches[0])/(last_times[1] - last_times[0])
    # slope2 = (last_pitches[2] - last_pitches[1])/(last_times[2] - last_times[1])
    #with open('out.csv', 'a') as f:
     # f.write(str(time)+','+str(pitch)+"\n")

    if success:
      if not sign(slope1) == sign(slope2):
        compare = 0
        if sign(slope1) == 1.0:
          peak = True
          if last_extrema_low:
            compare = last_extrema_low

          # if not last_extrema_high:
          last_extrema_high = last_pitches[1]
        else:
          peak = False
          if last_extrema_high:
            compare = last_extrema_high

          # if not last_extrema_low:
          last_extrema_low = last_pitches[1]

        local_extrema = last_times[1]

        if prev_local_extrema:
          threshold = abs(last_pitches[1] - compare)
          if threshold > .8:
            interval = abs(local_extrema-prev_local_extrema)
            print "Interval: "+str(interval)+" - "+str(threshold)+" - "+str(last_pitches[1])+" - "+str(compare)
            with open('intervals.csv', 'a') as f:
              f.write(str(prev_local_extrema)+','+str(local_extrema)+','+str(interval)+"\n")
            resp =requests.post('http://cardiobeats.azurewebsites.net/update',{'interval':interval})
          else:
            print "Threshold not met: "+str(threshold)+" - "+str(last_pitches[1])+" - "+str(compare)
          prev_local_extrema = local_extrema
        else:
          prev_local_extrema = local_extrema
          







  # Print out the rotation and arm state on the same line each update
  # print "Pitch:"+str(pitch)+", Time:"+str(time)
  
  # List of poses = rest, fist, waveIn, waveOut, fingersSpread, reserved1, thumbtoPinky, unkown
  if (pose_str == "fist") and (last_pose != myo.getPose()):
    myo.vibrate(Myo.VIBE_MEDIUM)

  if (pose_str == "fist") and (last_pose != myo.getPose()):
    resp = requests.post('http://cardiobeats.azurewebsites.net/toggle-play', {})
  
  last_pose = myo.getPose()

def main():
  myMyo = Myo(callback=printData)
  myMyo.daemon = True
  myMyo.start()
  raw_input("Press enter to exit")
      
if __name__ == "__main__":
    main()