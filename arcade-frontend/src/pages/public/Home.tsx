import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        ¡Bienvenido a ARCADESTORE!
      </h1>
      <p className="text-lg text-neutral max-w-2xl mx-auto mb-10">
        La mejor tienda donde encontraras juegos de paga y gratis y los puedes jugar desde la tienda
      </p>

      <div className="mx-auto w-64 h-64 rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border border-dashed border-base-200 flex flex-col items-center justify-center">
        <a
          href="https://play-lh.googleusercontent.com/9Y76p0lC8uBzSD8TR2WkRNPZ-wlK8muMH5nvI3Sz-EvR4AS36NeiOWwEIxnvJK4giMA"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2"
          aria-label="Abrir colección en una nueva pestaña"
        >
          <img
            src="https://play-lh.googleusercontent.com/9Y76p0lC8uBzSD8TR2WkRNPZ-wlK8muMH5nvI3Sz-EvR4AS36NeiOWwEIxnvJK4giMA"
            alt="Imagen de la colección"
            className="w-32 h-32 object-contain rounded-md"
            loading="lazy"
          />
          <span className="text-neutral">Ir a la colección</span>
        </a>
      </div>

      <div className="mt-10">
        <Link
          to="/tienda"
          className="btn btn-primary px-8 py-3 rounded-full font-semibold shadow-lg"
        >
          Explorar Juegos
        </Link>
      </div>
    </div>
  );
};

export default Home;
