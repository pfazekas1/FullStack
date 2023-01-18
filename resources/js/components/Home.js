import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";

const Home = ({}) => {
    return (
        <>
            <Box sx={{ bgcolor: "black" }}>
                <div id="sword">
                    <div id="pommel">
                        <div id="grip">
                            <div id="guard">
                                <div id="blade">
                                    <div id="filler"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="bonfire">
                    <div id="bonfire2">
                        <div id="bonfire3"></div>
                    </div>
                </div>

                <div className="fire">
                    <div className="fire1 flame"></div>
                    <div className="fire2"></div>
                    <div className="fire3"></div>
                    <div className="fire4"></div>
                </div>
            </Box>
        </>
    );
};

export default Home;
