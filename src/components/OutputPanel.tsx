import React from "react";
import "./Output.css";

const OutputPanel: React.FC = () => {
    return (
        <div className="output-panel">

            <div className="card">
                <div className="card-header">
                    <h4>Description</h4>
                    <button>Copy</button>
                </div>

                <p>
                    Carry less, own more. This slim leather wallet fits 6 cards and your
                    everyday essentials without the bulk.
                </p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Meta Title</h4>
                    <button>Copy</button>
                </div>

                <p>Leather Minimalist Wallet — Slim RFID-Blocking Card Holder</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Meta Description</h4>
                    <button>Copy</button>
                </div>

                <p>
                    Shop our slim RFID-blocking leather wallet. Holds 6 cards, built to
                    last.
                </p>
            </div>

            <div className="card">
                <h4>Tags</h4>
                <div className="tags">
                    <span>minimalist wallet</span>
                    <span>leather wallet</span>
                    <span>RFID wallet</span>
                    <span>slim wallet</span>
                </div>
            </div>

        </div>
    );
};

export default OutputPanel;