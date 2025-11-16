type HeroProps = {
  greeting?: string;
};

const Hero = ({ greeting = 'Hola mundo' }: HeroProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-balance text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Personal starter</p>
      <h1 className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
        {greeting}
      </h1>
      
    </section>
  );
};

export default Hero;
