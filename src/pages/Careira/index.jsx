import ModuleCarteira from "./modules";
import CarteiraProvider from "./context";

const Carteira = () => {
  return (
    <CarteiraProvider>
      <ModuleCarteira />
    </CarteiraProvider>
  );
};

export default Carteira;
