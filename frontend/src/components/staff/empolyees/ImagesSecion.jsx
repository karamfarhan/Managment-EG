const ImagesSecion = ({ empolyee, imgModelHandler }) => {
  return (
    <>
      {empolyee.identity_image !== null ? (
        <figure>
          <img
            src={empolyee.identity_image}
            alt="identity"
            onClick={() => imgModelHandler(empolyee.identity_image)}
          />
          <figcaption>اثبات الشخصية</figcaption>
        </figure>
      ) : (
        ""
      )}
      {empolyee.certificate_image !== null ? (
        <figure>
          <img
            src={empolyee.certificate_image}
            alt="certificate"
            onClick={() => imgModelHandler(empolyee.certificate_image)}
          />
          <figcaption>شهادة التخرج </figcaption>
        </figure>
      ) : (
        ""
      )}
      {empolyee.criminal_record_image !== null ? (
        <figure>
          <img
            onClick={() => imgModelHandler(empolyee.criminal_record_image)}
            src={empolyee.criminal_record_image}
            alt="criminal-record"
          />
          <figcaption>فيش و تشبيه</figcaption>
        </figure>
      ) : (
        ""
      )}
      {empolyee.experience_image !== null ? (
        <figure>
          <img
            src={empolyee.experience_image}
            alt="experience"
            onClick={() => imgModelHandler(empolyee.experience_image)}
          />
          <figcaption>شهادات الخبرة</figcaption>
        </figure>
      ) : (
        ""
      )}
    </>
  );
};

export default ImagesSecion;
