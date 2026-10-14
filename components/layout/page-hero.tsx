import Image from "next/image";
import { Container } from "@/components/ui/container";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
}

export function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative flex h-[45vh] min-h-[320px] items-center justify-center overflow-hidden">
      <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <Container className="relative z-10 text-center">
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-white/85">{subtitle}</p>}
      </Container>
    </section>
  );
}
