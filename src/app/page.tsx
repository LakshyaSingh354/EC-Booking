"use client";

import { useEffect } from "react";
import Head from "next/head";

const Home = () => {
  useEffect(() => {
    // Update preview elements
    const previews = document.getElementsByClassName("preview");
    Array.from(previews).forEach((element) => {
      element.innerHTML = (element as HTMLElement).innerText;
    });
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Business Consultation Services" />
        <link rel="stylesheet" href="../../public/css/bootstrap.min.css" />
        <link rel="stylesheet" href="../../public/css/style.css" />
        <link rel="stylesheet" href="../../public/css/responsive.css" />
      </Head>

      <main className="fix">
        {/* Banner Section */}
        <section className="banner-area-three">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-7 col-md-9 order-0 order-lg-2">
                <div className="top" data-aos="fade-left" data-aos-delay="300">
                  <img src="/img/banner/job-consultancy-01.jpg" alt="Main" className="main-img" width={500}
  height={300} />
                  <img src="/img/banner/h3_banner_img02.jpg" alt="Secondary" className="img-two" data-parallax='{"y": 100}' />
                  <img src="/img/banner/h3_banner_img03.jpg" alt="Tertiary" className="img-three" data-parallax='{"x": -100}' />
                </div>
              </div>
              <div className="col-lg-5">
                <div className="banner-content-three">
                  <h2 className="title">Need Business Consultation Today</h2>
                  <p>
                    Agilos helps you to convert your data into a strategic asset and get top-notch business insights.
                  </p>
                  <form action="/search" method="GET" className="banner-form" data-aos="fade-right" data-aos-delay="600">
                    <input type="text" name="query" placeholder="Search Here Job. . ." required />
                    <button type="submit">
                      <i className="flaticon-right-arrow"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="banner-shape-wrap-three">
            <img src="/img/banner/h3_banner_shape01.png" alt="Shape 1" />
            <img src="/img/banner/h3_banner_shape02.png" alt="Shape 2" />
          </div>
        </section>

        {/* Brand Section */}
        <section className="brand-area-two">
          <div className="container">
            <div className="brand-item-wrap">
              <h6 className="title">Our Trusted Clients</h6>
              <div className="row brand-active">
                <div className="col-lg-12">
                  <div className="brand-item">
                    <img src="/img/brands/brand_img01.png" alt="Brand 1" />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="brand-item">
                    <img src="/img/brands/brand_img02.png" alt="Brand 2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-area-three">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-6 col-lg-7">
                <div className="section-title-two text-center mb-40">
                  <span className="sub-title">Our Services</span>
                  <h2 className="title">We Provide Best Business Solutions</h2>
                </div>
              </div>
            </div>
            <div className="features-item-wrap-two">
              <div className="row justify-content-center">
                <div className="col-xl-3 col-lg-4 col-md-6">
                  <div className="features-item-three">
                    <div className="features-icon-three">
                      <i className="flaticon-profit"></i>
                    </div>
                    <div className="features-content-three">
                      <h2 className="title">Business Growth</h2>
                      <p>Helping businesses achieve sustainable growth with expert strategies.</p>
                      <a href="/services/business-growth" className="link-btn">
                        See Details <img src="/img/icons/right-arrow.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6">
                  <div className="features-item-three">
                    <div className="features-icon-three">
                      <i className="flaticon-mission"></i>
                    </div>
                    <div className="features-content-three">
                      <h2 className="title">Market Analysis</h2>
                      <p>Providing insights into market trends and customer behavior.</p>
                      <a href="/services/market-analysis" className="link-btn">
                        See Details <img src="/img/icons/right-arrow.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="cta-area-two">
          <div className="container">
            <div className="cta-inner-wrap-two" data-background="/images/bg/cta_bg02.jpg">
              <div className="row align-items-center">
                <div className="col-lg-9">
                  <div className="cta-content">
                    <div className="cta-info-wrap">
                      <div className="icon">
                        <i className="flaticon-phone-call"></i>
                      </div>
                      <div className="content">
                        <span>Call For More Info</span>
                        <a href="tel:+917977515433">+91-7977515433</a>
                      </div>
                    </div>
                    <h2 className="title">Let’s Request a Schedule For Free Consultation</h2>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="cta-btn text-end">
                    <a href="/contact" className="btn btn-three">Contact Us</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
