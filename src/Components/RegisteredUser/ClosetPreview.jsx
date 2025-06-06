import { useState,useEffect  } from "react";
import { Container, Modal, Button, Card, Row, Col, Form } from "react-bootstrap";
import "../CustomCss/Closet.css";
import "../CustomCss/AddItemCloset.css";
import AddAdvertisementPopupCloset from "./AddAdvertisementPopupCloset";
import ArticleDetailsModal from "./ArticleDetailsModal";
import SpinningWheel from "../SpinningWheel"
const ClosetPreview = ({ show, handleClose, closet }) => {
  if (!closet) return null;

  const { name, numberOfDrawers, numberOfShelves, numberOfHangers, closetID, articles } = closet;
  const [showDetails, setShowDetails] = useState(false);
  const [activeElement, setActiveElement] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [cardsData, setCardsData] = useState(articles);
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState(null); 
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const postCardsData = async () => {
  //     try {
  //       const response = await fetch("/api/addClothes", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ cards: cardsData }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const result = await response.json();
  //       console.log("Successfully sent cardsData to backend:", result);
  //     } catch (error) {
  //       console.error("Error sending cardsData to backend:", error);
  //     }
  //   };

  //   if (cardsData.length > 0) {
  //     postCardsData();
  //   }
  // }, [cardsData]);
  
  // useEffect(() => {
  //   if (activeElement !== null) {
  //     getArticles(activeElement);
  //   }
    
  // }, [activeElement]);

  const postArticle = async (articleName, articlePicture, category, seasonality, formality, maincolor, secondarycolor, availability, activeElement, closetID) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("articleName", articleName);
    formData.append("articlePicture", articlePicture);
    formData.append("category", category);
    formData.append("seasonality", seasonality);
    formData.append("formality", formality);
    formData.append("maincolor", maincolor);
    formData.append("secondarycolor", secondarycolor);
    formData.append("availability", availability);
    formData.append("activeElement", activeElement);
    formData.append("closetID", closetID);
    try {
      const response = await fetch("/api/addArticle", {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      setShowModal(false);
      if (!response.ok) {
        throw new Error();
      }
    } catch (error) {
      console.error("error adding article");
    } finally {
      setLoading(false);
    }
  };

  // const getArticles = (element) => {
  //   fetch(`/api/getUserArticles?activeElement=${element}&closetID=${closetID}`, {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include'
  //   }).then((response) => {
  //     return response.json()
  //   }).then((data) => {
  //     if (data !== null) {
  //       data.map((el) => {
  //         el["elementName"] = activeElement;
  //       })
  //     }
  //     setCardsData(data);
  //     setShowDetails(true);
  //   })
  // }


  const maxItems = 5;

  const handleAddItemCloset = (articleName, category, image, season, color, secondaryColor, formality, condition, description, forSharing, file) => {
    const newItem = {
        elementName: activeElement,
        closetName: name,
        articleName: articleName,
        text: "",
        image: image,
        forSharing, 
        category,
        season,
        color,
        secondaryColor,
        formality,
        condition,
        description,
    };
    console.log(file);
    postArticle(articleName, file, category, season, formality, color, secondaryColor, condition, activeElement, closetID);
    setCardsData([...cardsData, newItem]);
    console.log("Updated cardsData:", [...cardsData, newItem]);
};


  const handleAddItemClick = () => {
    setShowModal(true);
  };

  const handleCardClick = (cardIndex, elementName) => {
   
    const card = cardsData.filter((card) => card.elementName === elementName)[cardIndex];
    

    console.log("Card clicked:", card); 
  
    if (card) {
   
      setSelectedCardData(card);
      setShowEditModal(true);
      console.log("Selected card data updated:", card); // Log after setting the selected card
      
    }
    console.log("Updated cardsData after card click:", cardsData);

  };
  
  const handleCardUpdate = (updatedCard) => {
    setCardsData((prevCards) =>
      prevCards.map((card) =>
        card === selectedCardData ? { ...updatedCard } : card
      )
    );
    setSelectedCardData(updatedCard); // Update modal's card data
    console.log("Updated cardsData after card click:", cardsData);

  };
  

  const handleForSharingChange = (card, newForSharingValue) => {
    console.log("Before update:", cardsData);
  
    const updatedCards = cardsData.map((c) =>
      c === card ? { ...c, forSharing: newForSharingValue } : c
    );
  
    console.log("Updating card:", card);
    console.log("New forSharing value:", newForSharingValue);
  
    setCardsData(updatedCards);
  
 
    console.log("After update:", updatedCards);
  
  
    if (selectedCardData === card) {
      const updatedCard = { ...card, forSharing: newForSharingValue };
      setSelectedCardData(updatedCard);
      console.log("Updated selectedCardData:", updatedCard);
    }
  };
  const renderCard = (index, elementName) => {
    const card = cardsData.filter((card) => card.elementName === elementName)[index];
    if (!card) return null;

    const isActive = activeCardIndex === cardsData.indexOf(card);
    return (
      <Card
        className={`custom-card ${isActive ? "active-card" : ""}`}
        key={`${elementName}-${index}`}
        style={{ border: isActive ? "2px solid blue" : "none" }}
        onClick={() => handleCardClick(index, elementName)} 
      >
        <Card.Img
          variant="top"
          src={card.image}
          alt={`Card ${index + 1}`}
        />
        <Card.Body className="card-body-closet">
          <Card.Title className="custom-title">{card.articleName}</Card.Title>
          <Card.Text className="custom-text">{card.text}</Card.Text>
        </Card.Body>
      </Card>
    );
  };

  const renderActiveElementItems = () => {
    const filteredCards = cardsData.filter((card) => card.elementName === activeElement);
    const itemCount = Math.min(filteredCards.length, maxItems);
    console.log(activeElement);
    const rows = [0, 1].map((rowIndex) => (
      <Row className="custom-row" key={`row-${rowIndex}`}>
        {Array(3)
          .fill(null)
          .map((_, colIndex) => {
            if (rowIndex === 1 && colIndex === 2) {
              return <Col key={`col-${rowIndex}-${colIndex}`}></Col>;
            }
            const cardIndex = rowIndex * 3 + colIndex;
            if (cardIndex < itemCount) {
              return (
                <Col key={`col-${rowIndex}-${colIndex}`}>
                  {renderCard(cardIndex, activeElement)}
                </Col>
              );
            }
            return <Col key={`col-${rowIndex}-${colIndex}`}></Col>;
          })}
      </Row>
    ));

    return rows;
  };

  const renderShelves = () => {
    const shelves = [];
    const maxShelves = 5;
    for (let i = 0; i < numberOfShelves; i++) {
      shelves.push(
        <div
          key={`shelf-${i}`}
          className={`shelf ${activeElement === `shelf-${i}` ? "active-element" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowDetails(true);
            setActiveElement(`shelf-${i}`);
          }}
        ></div>
      );
    }

    if (numberOfShelves < maxShelves) {
      shelves.push(
        <div
          key="big-square"
          className="big-square"
        ></div>
      );
    }
    return shelves;
  };

  const renderHangers = () => {
    const hangers = [];
    for (let i = 0; i < numberOfHangers; i++) {
      hangers.push(
        <div
          key={`hanger-${i}`}
          className={`hanger${i + 1} ${activeElement === `hanger-${i}` ? "active-element" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowDetails(true);
            setActiveElement(`hanger-${i}`);
          }}
        ></div>
      );
    }
    return hangers;
  };

  const renderModalDrawers = () => {
    const modalDrawers = [];
    for (let i = 0; i < numberOfDrawers; i++) {
      modalDrawers.push(
        <div
          key={`drawer-${i}`}
          className={`modal-drawer1 ${activeElement === `drawer-${i}` ? "active-element" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowDetails(true);
            setActiveElement(`drawer-${i}`);
          }}
        >
          <div className="modal-handle"></div>
        </div>
      );
    }
    return modalDrawers;
  };

  const handleNavigationButtonClick = () => {
    setShowDetails(false);
    setActiveElement(null);
    setActiveCardIndex(null);
    setChecked(false);
  };

  return (
    <div style={{ height: "100%" }}>
      {loading && (<SpinningWheel />)}
      <Modal
        className="closet-modal"
        show={show}
        onHide={handleClose}
        centered
        fullscreen
        animation
        backdrop="static"
        keyboard={false}
      >
        <Container fluid className="closet-container-modal">
          <div className="modal-header-closet">
            <h2 className="modal-name">{name}</h2>
            <div className="modal-button">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>

          {!showDetails ? (
            <div className="just-closet-without-articles">
              <div className="modal-second-row">
                <div className="modal-shelves">{renderShelves()}</div>
                <div className="modal-hangers">{renderHangers()}</div>
              </div>
              <div className="modal-third-row">{renderModalDrawers()}</div>
            </div>
          ) : (
            <div className="sec-and-third">
              <div className="just-closet">
                <div className="modal-second-row">
                  <div className="modal-shelves">{renderShelves()}</div>
                  <div className="modal-hangers">{renderHangers()}</div>
                </div>
                <div className="modal-third-row">{renderModalDrawers()}</div>
              </div>
              <div className="modal-articles d-flex flex-column align-items-stretch">
                <Container className="articles-background p-3">
                  <div className="navigation-button-wrapper-closet">
                    <Button
                      className="navigation-button-closet left"
                      onClick={handleNavigationButtonClick}
                    >
                      &#8249;
                    </Button>
                  </div>
                  {renderActiveElementItems()}
                </Container>
                <div className="closet-button-and-share">
                  <Button
                    className="add-item-closet"
                    onClick={handleAddItemClick}
                    disabled={cardsData.filter(card => card.elementName === activeElement).length >= maxItems}
                  >
                    Add Item
                  </Button>

                </div>
              </div>
            </div>
          )}
        </Container>
      </Modal>

      <AddAdvertisementPopupCloset
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        handleAddItemCloset={handleAddItemCloset} 
      />
        {showEditModal && selectedCardData && (
          <ArticleDetailsModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          cardData={selectedCardData}
          onCardUpdate={handleCardUpdate} 
          onForSharingChange={handleForSharingChange}
        />
      )}

    </div>
  );
};

export default ClosetPreview;
