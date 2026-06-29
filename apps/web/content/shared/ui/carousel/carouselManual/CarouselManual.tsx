/* COMPONENTS */
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./components/ManualArrowButtons";

/* HOOKS */
import useEmblaCarousel from "embla-carousel-react";

/* STYLES */
import "./styles/styles.css";

/* TYPES */
import { EmblaOptionsType } from "embla-carousel";

export function CarouselManual({
  slides,
  options,
}: {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="embla flex gap-6 items-center">
      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((s, i) => (
            <div className="embla__slide" key={i}>
              <div className="select-none">{s}</div>
            </div>
          ))}
        </div>
      </div>
      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
    </div>
  );
}
