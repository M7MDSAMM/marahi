import { imagePath } from "../data";
import { useStore } from "../store";

export default function StoryPhoto() {
  const { ar } = useStore();
  return (
    <figure className="story-photo">
      <img src={imagePath("traditional")} alt={ar ? "بسيسة تونسية في أواني تقليدية" : "Bsissa tunisienne dans des bols traditionnels"} loading="lazy" />
      <figcaption>{ar ? "البسيسة التونسية، بنّة نتوارثوها." : "La bsissa tunisienne, un goût qui se transmet."}</figcaption>
    </figure>
  );
}
