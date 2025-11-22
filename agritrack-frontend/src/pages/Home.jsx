import React from "react";
import { Card, Accordion, Button } from "react-bootstrap";
import {
  Leaf,
  Tractor,
  BarChart3,
  Users,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  return (
    <div className="container-fluid p-0">
      {/*  Hero Section with Background Image */}
      <header
        className="text-center text-white py-5 shadow-sm position-relative"
        style={{
          backgroundImage:
            "url('https://i1.pickpik.com/photos/610/396/38/agriculture-animals-background-clouds-preview.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Overlay for readability */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        ></div>

        {/* Hero Text */}
        <div className="position-relative" style={{ zIndex: 2 }}>
          <h1 className="fw-bold display-4 text-light">Welcome to AgriTrack</h1>
          <p className="lead mt-3 text-white-50 px-3" style={{ maxWidth: "700px" }}>
            Empowering farmers through technology — manage your crops, livestock,
            and finances with ease.
          </p>
          <a
            href="/market"
            className="btn btn-success mt-3 px-4 fw-semibold shadow-lg"
          >
            Visit Market
          </a>
        </div>
      </header>

      {/*  Carousel Section  */}
      <div
        id="carouselExample"
        className="carousel slide mt-5 mx-auto"
        style={{ maxWidth: "900px" }}
      >
        <div className="carousel-inner rounded-4 shadow">
          <div className="carousel-item">
            <img src="/images/farm2.jpg" className="d-block w-100" alt="Crops" />
          </div>
          <div className="carousel-item">
            <img
              src="/images/farm3.jpg"
              className="d-block w-100"
              alt="Livestock"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      {/* ===== Features Section ===== */}
      <section className="container text-center mt-5">
        <h3 className="fw-bold mb-4 text-success">Why Choose AgriTrack?</h3>
        <p className="text-muted mb-5">
          Our platform connects farmers, buyers, and investors to make agriculture
          smarter and more profitable.
        </p>

        <div className="row g-4">
          <div className="col-md-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Leaf color="green" size={40} />
                <h5 className="fw-bold mt-3">Smart Crop Management</h5>
                <p className="text-muted">
                  Track and monitor your crops in real time with analytics for
                  better decision-making.
                </p>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Tractor color="brown" size={40} />
                <h5 className="fw-bold mt-3">Livestock Tracking</h5>
                <p className="text-muted">
                  Manage livestock health, productivity, and breeding schedules
                  with ease.
                </p>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <BarChart3 color="blue" size={40} />
                <h5 className="fw-bold mt-3">Financial Insights</h5>
                <p className="text-muted">
                  Gain visibility into your income and expenses for a sustainable
                  farm business.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section className="bg-light mt-5 py-5 text-center">
        <div className="container">
          <h3 className="fw-bold mb-4 text-success">About AgriTrack</h3>
          <p className="text-muted px-5">
            AgriTrack is an integrated agricultural management platform designed
            to help farmers digitize their farm operations, improve productivity,
            and connect with buyers directly.
            <br />
            We combine modern technology, data analytics, and community-driven
            innovation to empower the agricultural ecosystem.
          </p>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="container mt-5 mb-5">
        <h3 className="fw-bold text-center mb-4 text-success">
          FAQs
        </h3>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>What is AgriTrack?</Accordion.Header>
            <Accordion.Body>
              AgriTrack is a digital farm management system that helps farmers
              track their crops, livestock, and finances — all in one platform.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Is AgriTrack free to use?</Accordion.Header>
            <Accordion.Body>
              Yes! AgriTrack offers a free version with core features. Premium
              plans are available for additional analytics and integrations.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>How can I contact support?</Accordion.Header>
            <Accordion.Body>
              You can reach our support team anytime through the “Contact Us”
              section or via email at{" "}
              <strong>support@agritrack.com</strong>.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </section>

      {/* ===== Footer Section ===== */}
      <footer className="bg-dark text-white mt-5 py-4">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5>AgriTrack</h5>
              <p className="small">
                Smart solutions for a better farming future.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h6>Quick Links</h6>
              <ul className="list-unstyled small">
                <li>
                  <a href="/about" className="text-white text-decoration-none">
                    About
                  </a>
                </li>
                <li>
                  <a href="/market" className="text-white text-decoration-none">
                    Market
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-white text-decoration-none">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h6>Follow Us</h6>
              <div className="d-flex justify-content-center gap-3">
                <Users size={20} />
                <MessageCircle size={20} />
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>
          <p className="mt-3 small mb-0">
            © {new Date().getFullYear()} AgriTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
