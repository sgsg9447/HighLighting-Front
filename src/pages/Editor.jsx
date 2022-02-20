import React from 'react';
import Header from "../components/Header";
import Wrapper from '../components/editor/Wrapper';

import A_VideoPlayer from '../components/editor/A_VideoPlayer';
import B_ChatViewer from '../components/editor/B_ChatViewer';
import C_DataChart from '../components/editor/C_DataChart';
import D_BookMarker from '../components/editor/D_BookMarker';
import E_CommunicationTool from '../components/editor/E_CommunicationTool';



function Editor() {
    return (
        <>
            <Header />
            <Wrapper id = 'upper_layer'>

                <Wrapper id = 'VideoPlayer_cover'>
                    <A_VideoPlayer />
                </Wrapper>

                <Wrapper id = 'ChatViewer_cover'>
                    <B_ChatViewer />
                </Wrapper>

                <Wrapper id = 'CommunicationTool_cover'>
                    <E_CommunicationTool />
                </Wrapper>

            </Wrapper>

            <Wrapper id = 'lower_layer'>

                <Wrapper id = 'BookMarker_cover'>
                    <D_BookMarker />
                </Wrapper>

                <Wrapper id = 'DataChart_cover'>
                    <C_DataChart />
                </Wrapper>

            </Wrapper>
        </>
    );
}

export default Editor;