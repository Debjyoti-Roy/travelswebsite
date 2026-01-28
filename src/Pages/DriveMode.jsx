import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DriveMode = () => {
    const navigate = useNavigate();
    const pickupActive = useSelector(
        (state) => state.driveMode.pickupActive
    );
    

    useEffect(() => {
        console.log(pickupActive)
    }, [pickupActive])


    //   useEffect(() => {
    //     const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    //     if (!isMobile) {
    //       navigate("/", { replace: true });
    //     }
    //   }, [navigate]);

    return <div className="min-h-screen">DriveMode</div>;
};

export default DriveMode;
