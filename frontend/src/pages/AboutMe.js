import React, { lazy, Suspense } from "react";
import './AboutMe.css';

const NetworkGraph = lazy(() => import('../components/network_graph/NetworkGraph'));

const AboutMe = () => {
    return (
        <div className="App-content-stuff d-flex flex-column">
            <Suspense fallback={<div className="network-graph-loading">Loading…</div>}>
                <NetworkGraph />
            </Suspense>
        </div>
    );
};

export default AboutMe;
