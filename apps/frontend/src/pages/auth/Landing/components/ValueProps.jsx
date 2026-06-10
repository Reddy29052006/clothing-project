import { VALUE_PROPS } from '../data/landingData';

const ValueProps = () => {
  return (
    <section className="section value-props">
      <div className="container">
        <div className="value-props__grid">
          {VALUE_PROPS.map((v, i) => {
            const Icon = v.Icon;
            return (
              <div key={v.title} className={`value-card reveal delay-${(i + 1) * 100}`}>
                <div className="value-card__icon"><Icon size={28} /></div>
                <h4 className="value-card__title">{v.title}</h4>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
