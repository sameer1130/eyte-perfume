import { ArabianHome } from "@/components/home/arabian/ArabianHome";
import { FloralHome } from "@/components/home/floral/FloralHome";
import { HOME_THEME } from "@/config/theme";

export default function HomePage() {
  return HOME_THEME === "floral" ? <FloralHome /> : <ArabianHome />;
}
