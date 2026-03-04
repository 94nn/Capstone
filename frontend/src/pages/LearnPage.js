import React from "react";
import LessonLayout from "../components/LessonLayout";
import SidebarProfile from "../components/SidebarProfile";

function LearnPage() {
    return (
        <main className="main-layout">
            <LessonLayout />
            <SidebarProfile />
        </main>
    );
}

export default LearnPage;

