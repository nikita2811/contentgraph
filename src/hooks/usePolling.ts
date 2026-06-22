import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../api/axiosInstance";

interface PollResult<T> {
    status: "pending" | "started" | "success" | "failed";
    error_message?: string;
    result?: T;
}

export const usePolling = <T = unknown>(taskId: string | null, interval = 3000) => {
    const [status, setStatus] = useState<PollResult<T>["status"]>("pending");
    const [isDone, setIsDone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<T | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        // Reset all state on every new taskId (including null)
        setStatus("pending");
        setIsDone(false);
        setError(null);
        setResult(null);
        stopPolling();

        if (!taskId) return;

        let cancelled = false;

        const poll = async () => {
            try {
                const response = await api.get<PollResult<T>>(`/content/generate/${taskId}`);
                const data = response.data;

                if (cancelled) return;

                setStatus(data.status);

                if (data.status === "done") {
                    setResult((data.result ?? data) as T);  // ← fallback to whole response if no result key
                    setIsDone(true);
                    stopPolling();
                }

                if (data.status === "failed") {
                    setIsDone(true);
                    setError(data.error_message || "Something went wrong");
                    stopPolling();
                }
            } catch {
                if (!cancelled) {
                    stopPolling();
                    setError("Failed to fetch task status");
                }
            }
        };

        // assign interval BEFORE first poll so stopPolling always has a ref to clear
        intervalRef.current = setInterval(poll, interval);
        poll();

        return () => {
            cancelled = true;
            stopPolling();
        };
    }, [taskId, interval, stopPolling]);

    return { status, isDone, error, result };
};