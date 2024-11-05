import { usePlausible } from "next-plausible";

export const useAnalytics = () => {
  const plausible = usePlausible();

  const trackCallClick = () => {
    plausible("call-click");
  };

  return { trackCallClick };
};
