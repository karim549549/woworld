import React, { useMemo } from "react";
import { HorizontalFlowingCards } from "@/components/ui/horizontal-flowing-cards";
import OptimizedCard from "./featured-issue-card";
import { featuredIssues } from "./data";

const FeaturedIssues: React.FC = () => {
  const cards = useMemo(
    () =>
      featuredIssues.map((issue, idx) => (
        <OptimizedCard key={issue.id} {...issue} priority={idx < 2} />
      )),
    []
  );

  return (
    <section aria-label="Featured magazines">
      <HorizontalFlowingCards
        cards={cards}
        autoPlay={true}
        speed={0.8}
        cardWidth={320}
        gap={24}
        dragSensitivity={1}
      />
    </section>
  );
};

export default FeaturedIssues;