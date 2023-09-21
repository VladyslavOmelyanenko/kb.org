import styles from './Wires.module.scss';


const Wires = (props) => {
  const container = props.container;
  console.log(container);

  const getClosestImageToCenter = (side) => {
    const images = container.querySelectorAll("img");

    if (images.length === 0) {
      return null; 
    }

    const containerRect = container.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;

    let closestImage = null;
    let minDistance = Infinity;

    images.forEach((element) => {
      const elementRect = element.getBoundingClientRect();
      const elementCenterX = elementRect.left + elementRect.width / 2;

      const distance = Math.abs(elementCenterX - containerCenterX);

      if (
        (side === "left" && elementCenterX < containerCenterX) ||
        (side === "right" && elementCenterX > containerCenterX)
      ) {
        if (distance < minDistance) {
          closestImage = element;
          minDistance = distance;
        }
      }
    });

    return closestImage;
  }
  
  const moveImageToCenter = (side) => {
    const closestImage = getClosestImageToCenter(side);

    if (!closestImage) {
      console.log("No suitable image found to move.");
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const imageRect = closestImage.getBoundingClientRect();
    let desiredScrollLeft =
      imageRect.left -
      containerRect.left -
      containerRect.width / 2 +
      imageRect.width / 2;

    if (side === "left") {
      desiredScrollLeft -= 5;
    } else if (side === "right") {
      desiredScrollLeft += 5;
    }
    container.scrollLeft += desiredScrollLeft;
  }

  return (
    <>{ (container?.scrollWidth > container?.clientWidth) && 
      <>
        <img
          onClick={(e) => moveImageToCenter("left")}
          className={`${styles.leftWire}`}
          src={process.env.PUBLIC_URL + "/left-wire.png"}
          alt="left wire"
        ></img>
        <img
          onClick={(e) => moveImageToCenter("right")}
          className={`${styles.rightWire}`}
          src={process.env.PUBLIC_URL + "/right-wire.png"}
          alt="right wire"
        ></img>
      </>
    }
    </>
  );
};

export default Wires;