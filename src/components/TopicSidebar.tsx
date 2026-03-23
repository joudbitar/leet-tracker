import { CURRICULUM, SIDEBAR_TOPICS, TOPIC_CATEGORIES } from '../data/curriculum'

interface TopicSidebarProps {
  checked: Set<string>
}

export function TopicSidebar({ checked }: TopicSidebarProps) {
  const topicStats = SIDEBAR_TOPICS.map(topic => {
    const problems = CURRICULUM
      .filter(w => TOPIC_CATEGORIES[w.topic] === topic)
      .flatMap(w => w.problems)
    const done = problems.filter(p => checked.has(p.id)).length
    return { topic, done, total: problems.length }
  })

  return (
    <div className="topic-sidebar">
      <h3 className="sidebar-title">Topics</h3>
      <div className="topic-list">
        {topicStats.map(({ topic, done, total }) => {
          const pct = total === 0 ? 0 : Math.round((done / total) * 100)
          return (
            <div key={topic} className="topic-item">
              <div className="topic-item-header">
                <span className="topic-name">{topic}</span>
                <span className="topic-pct">{pct}%</span>
              </div>
              <div className="topic-track">
                <div
                  className="topic-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
