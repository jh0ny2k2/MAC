import { useNavigate } from 'react-router-dom';
import { getCategoryPath } from '../../../../utils/sitemap';

const CategoryCard = ({ categoria }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(getCategoryPath({ id: categoria.id, nombre: categoria.nombre }));
  };

  return (
    <button
      onClick={handleCategoryClick}
      className="group flex flex-col items-center gap-3 p-5 bg-white rounded-xl hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-100 group-hover:ring-2 group-hover:ring-gray-300 transition-all duration-300">
        <img
          alt={categoria.nombre}
          className="object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-500"
          src={`/img/resmoke/${categoria.nombre}.png`}
          loading="lazy"
        />
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
        {categoria.nombre}
      </span>
    </button>
  );
};

export default CategoryCard;
