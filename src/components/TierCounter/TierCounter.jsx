import React, { useMemo } from "react";
import Progress from "./Progress";

const TierCounter = ({ members = [], tier3Active = false, userCount }) => {
    const { totalMembers, tier1Count, tier2Count, tier3Count } = useMemo(() => {
      let tier1 = 0, tier2 = 0, tier3 = 0;
    
      members.forEach(m => {
        if (m.courseProgress1 > 0 && m.courseProgress1 < 100) {
          tier1++;
        } else if (m.courseProgress1 === 100 && m.courseProgress2 < 100) {
          tier2++;
        } else if (tier3Active && m.courseProgress2 === 100) {
          tier3++;
        } else if (m.courseProgress1 === 0 && m.courseProgress2 === 0) {
          tier1++;
        }
      });

      return {
        totalMembers: members.length,
        tier1Count: tier1,
        tier2Count: tier2,
        tier3Count: tier3
      };
    }, [members, tier3Active]);
    
    const tier1Percentage = totalMembers > 0 ? (tier1Count / totalMembers) * 100 : 0;
    const tier2Percentage = totalMembers > 0 ? (tier2Count / totalMembers) * 100 : 0;
    const tier3Percentage = totalMembers > 0 ? (tier3Count / totalMembers) * 100 : 0;
  
  
    return (
      <div className="bg-white rounded-lg border border-gray-300/50 p-6 mb-6 shadow-sm w-full">
        <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {userCount} total registered users
        </h2>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {totalMembers} users with tier progression
        </h2>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-${tier3Active ? 3 : 2} gap-6 mb-6`}>
          {/* Tier 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Tier 1</span>
              <span className="text-lg font-bold text-green-600">{tier1Count}</span>
            </div>
            <Progress value={tier1Percentage} barColor="bg-blue-950" />
            <p className="text-xs text-[#7d7a7a]">{tier1Percentage.toFixed(1)}% of total</p>
          </div>
  
          {/* Tier 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600">Tier 2</span>
              <span className="text-lg font-bold text-green-600">{tier2Count}</span>
            </div>
            <Progress value={tier2Percentage} barColor="bg-blue-950" />
            <p className="text-xs text-[#7d7a7a]">{tier2Percentage.toFixed(1)}% of total</p>
          </div>
  
          {/* Tier 3 → only render if active */}
          {tier3Active && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Tier 3</span>
                <span className="text-lg font-bold text-green-600">{tier3Count}</span>
              </div>
              <Progress value={tier3Percentage} barColor="bg-blue-950" />
              <p className="text-xs text-[#7d7a7a]">{tier3Percentage.toFixed(1)}% of total</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  

export default TierCounter;
