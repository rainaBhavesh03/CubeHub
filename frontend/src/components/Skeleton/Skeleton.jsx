import './Skeleton.css';

const Skeleton = ({ height, width, varient='box'}) => {

    return (
        <div className={`skeleton-${varient}`} style={{height: height+'px', width: width+'px'}}></div>
    );
};

export default Skeleton;
