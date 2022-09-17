import logoImg from "../assets/logo.svg";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import api from "../services/api";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import "react-multi-carousel/lib/styles.css";
import { GameBanner } from "../components/GameBanner";
import { CreatedAdBanner } from "../components/CreatedAdBanner";
import { Spinner } from "../components/Spinner";
import { CreatedAdModal } from "../components/CreatedAdModal";

interface Game {
  id: string;
  bannerUrl: string;
  title: string;
  _count: {
    ads: number;
  };
}

export default function Home() {
  const [dataGames, setDataGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [ref] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 3, spacing: 5 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 6, spacing: 10 },
      },
    },
    slides: { perView: 1 },
  });

  useEffect(() => {
    api
      .get("/games")
      .then((response) => {
        setDataGames(response.data);
        setLoading(true);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, [api]);

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} alt="Logo" />
      <h1 className="text-6xl text-white font-black mt-20">
        Seu{" "}
        <span className="text-transparent bg-clip-text bg-nlw-gradient">
          duo
        </span>{" "}
        está aqui
      </h1>

      <div className="grid mt-16 items-center justify-center gap-[24px]">
        {loading ? (
          <div ref={ref} className="keen-slider">
            {dataGames ? (
              dataGames.map((item: any, index) => {
                return (
                  <div
                    key={item.id}
                    className={`relative rounded-lg overflow-hidden keen-slider__slide number-slide${index}`}
                  >
                    <GameBanner
                      bannerUrl={item.bannerUrl}
                      title={item.title}
                      adsCount={item._count.ads}
                    />
                  </div>
                );
              })
            ) : (
              <h1>Sem dados</h1>
            )}
          </div>
        ) : (
          <div className="mt-10 mb-10 text-white grid justify-center">
            <Spinner />
          </div>
        )}
      </div>

      <Dialog.Root>
        <CreatedAdBanner />
        <CreatedAdModal />
      </Dialog.Root>
    </div>
  );
}
