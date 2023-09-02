import styles from './Wires.module.scss';


const Wires = () => {
  return (
    <div className={styles.wires}>
      <img src={process.env.PUBLIC_URL + "/left-wire.png"} alt=""></img>
      <img src={process.env.PUBLIC_URL + "/right-wire.png"} alt=""></img>
    </div>
  )
};

export default Wires;