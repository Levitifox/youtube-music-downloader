import React, { useState, useRef, useLayoutEffect } from "react";

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    arrowAlignment?: "left" | "center" | "right";
}

export function Tooltip({ text, children, placement: preferredPlacement = "top", arrowAlignment = "center" }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState<{ left: string; top: string }>({
        left: "0px",
        top: "0px",
    });
    const [placement, setPlacement] = useState<"top" | "bottom" | "left" | "right">(preferredPlacement);
    const [arrowOffset, setArrowOffset] = useState<string>("50%");

    const timerRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        timerRef.current = window.setTimeout(() => {
            setVisible(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setVisible(false);
    };

    useLayoutEffect(() => {
        if (visible && containerRef.current && tooltipRef.current) {
            const gap = 8;
            const borderRadius = 6;
            const extraOffset = 6;

            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            const tooltipWidth = tooltipRef.current.offsetWidth;
            const tooltipHeight = tooltipRef.current.offsetHeight;

            let tooltipLeft = 0;
            let tooltipTop = 0;
            let computedArrowOffset = 0;

            if (preferredPlacement === "top" || preferredPlacement === "bottom") {
                if (arrowAlignment === "left") {
                    computedArrowOffset = borderRadius;
                    tooltipLeft = Math.round(containerWidth / 2 - computedArrowOffset - extraOffset);
                } else if (arrowAlignment === "right") {
                    computedArrowOffset = tooltipWidth - borderRadius;
                    tooltipLeft = Math.round(containerWidth / 2 - computedArrowOffset + extraOffset);
                } else {
                    computedArrowOffset = tooltipWidth / 2;
                    tooltipLeft = Math.round(containerWidth / 2 - computedArrowOffset);
                }
                tooltipTop = preferredPlacement === "top" ? -tooltipHeight - gap : containerHeight + gap;
            } else {
                tooltipTop = Math.round(containerHeight / 2 - tooltipHeight / 2);
                tooltipLeft = preferredPlacement === "left" ? -tooltipWidth - gap : containerWidth + gap;
                computedArrowOffset = tooltipHeight / 2;
            }

            setPosition({ left: `${tooltipLeft}px`, top: `${tooltipTop}px` });
            setPlacement(preferredPlacement);
            setArrowOffset(`${Math.round(computedArrowOffset)}px`);
        }
    }, [visible, preferredPlacement, arrowAlignment]);

    const extraClass = placement === "top" || placement === "bottom" ? `arrow-${arrowAlignment}` : "";

    return (
        <div
            className="tooltip-container"
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ position: "relative", display: "inline-block" }}
        >
            {children}
            {visible && (
                <div
                    className={`custom-tooltip tooltip-${placement} ${extraClass}`}
                    ref={tooltipRef}
                    style={
                        {
                            left: position.left,
                            top: position.top,
                            "--arrow-offset": arrowOffset,
                        } as React.CSSProperties
                    }
                >
                    {text}
                </div>
            )}
        </div>
    );
}
