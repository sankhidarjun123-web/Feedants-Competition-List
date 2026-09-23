import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Clock3 } from "lucide-react-native";

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),
      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),
      seconds: Math.floor(
        (difference / 1000) % 60
      ),
      expired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const format = (value: number) => String(value).padStart(2, "0");

  return (
    <View className="mx-4 mt-3 flex-row items-center justify-between rounded-xl bg-[#EDF8F8] px-4 py-4">
      <View className="flex-row items-center flex-1">
        <Clock3 size={21} color="#087F8C" />

        <View className="ml-3">
          <Text className="text-[13px] font-bold text-[#172B4D]">
            Registration closes in
          </Text>

          <Text className="mt-1 text-[11px] text-[#60708A]">
            {timeLeft.expired
              ? "Registration closed"
              : "Hurry up and register!"}
          </Text>
        </View>
      </View>

      {!timeLeft.expired && (
        <Text className="text-[13px] font-extrabold text-[#087F8C]">
          {format(timeLeft.days)}d : {format(timeLeft.hours)}h :{" "}
          {format(timeLeft.minutes)}m : {format(timeLeft.seconds)}s
        </Text>
      )}
    </View>
  );
};

export default CountdownTimer;