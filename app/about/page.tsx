'use client'

import Navbar from '@/app/components/Navbar'
import styles from './about.module.css'
import Image from 'next/image'

export default function About() {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.cloudIconLeft}>
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fisland-cloud-medium.svg?alt=media&token=5ba656af-b1c6-4a77-89e3-210fcfa78e12"
            alt="Cloud"
            width={120}
            height={80}
          />
        </div>
        <div className={styles.cloudIconRight}>
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fisland-cloud-medium.svg?alt=media&token=5ba656af-b1c6-4a77-89e3-210fcfa78e12"
            alt="Cloud"
            width={120}
            height={80}
          />
        </div>

        <div className={styles.mainContent}>
          <h1 className={styles.title}>Who we are</h1>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>SJ와 팀을 소개합니다</h2>
            <p className={styles.text}>
              SJ는 옥스포드 대학교 경제·경영학과를 졸업한 뒤, 서울에서 영미권 대학 입학 전문 아카데미를 운영하며 100% 러셀그룹 대학 합격률을 달성했습니다. 현재는 런던에서 에듀테크 스타트업 examrizz의 공동 창업자로 활동하고 있습니다.
            </p>
            <p className={styles.text}>
              SJ는 옥스포드 출신 교육 전문가들과 함께, 한국 수능 영어와 해외 입시의 핵심을 결합한 독해 훈련 플랫폼을 개발했습니다. 특히 옥스포드 튜토리얼 방식의 인터랙티브 집중 학습법을 AI로 구현한 것이 큰 장점입니다.
            </p>
            <p className={styles.text}>
              10년간의 입시 노하우와 글로벌 교육 경험을 바탕으로, 한국 학생들의 학술적 독해 능력을 체계적으로 향상시키는 것을 목표로 합니다.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.text}>
              "수능을 준비하면서 영어책도 읽을 수 있을까요?"
            </p>
            <p className={styles.text}>
              현재 학생들은 문법과 문제풀이 중심의 학습에 집중해야 하는 현실 속에서,<br />
              정작 사고력·비판적 사고를 길러주는 영어 능력의 중요성은 더욱 커지고 있습니다.
            </p>
            <p className={styles.text}>
              책 읽기는 영어를 '지적 도구'로 활용하는 가장 효과적인 방법이지만,<br />
              학습 환경과 시간 제약 때문에 꾸준히 실천하기 쉽지 않습니다.
            </p>
            <p className={styles.text}>
              PLEW는 이러한 독서의 기능을 대체하는 혁신적 독해 학습 솔루션입니다.
            </p>
            <p className={styles.text}>
              어려운 독해를 잘하기 위해 필요한 핵심 역량은 두 가지입니다.
            </p>
            <ol className={styles.list}>
              <li className={styles.listItem}>영어를 영어로 이해하는 문장 단순화 능력</li>
              <li className={styles.listItem}>지문의 논리 구조를 파악해 핵심 내용을 정확히 이해하는 능력</li>
            </ol>
            <p className={styles.text}>
              PLEW는 이 두 가지 능력을 AI 기반 1:1 튜터리얼로 체계적으로 훈련합니다.
            </p>
            <p className={styles.text}>
              옥스포드 튜토리얼 방식처럼, 학생이 스스로 학습할 수 있도록<br />
              단계별로 안내하는 깊이 있는 학습 경험을 제공합니다.
            </p>
            <p className={styles.text}>
              또한 공신력 있는 출처를 기반으로, 수능 지문 특유의 논리 구조와 평가원 기준에 맞춰 제작된 논픽션 지문과 수능 유사 '트윈 문제'를 제공합니다.
            </p>
            <p className={styles.text}>
              난이도별로 폭넓게 구성된 지문을 통해 초등학생부터 고3까지 누구나 자신의 수준에서 학습을 시작할 수 있습니다.
            </p>
            <p className={styles.text}>
              또한 학습자는 자신의 레벨에서 출발해 수능 영어 고난도 지문을 빠르고 정확하게 해결할 수 있는 독해 실력에 도달하도록 설계되어 있어, 시험 대비와 실제 독해력 향상을 동시에 이룰 수 있습니다.
            </p>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <p>이매일: team@examrizz.com</p>
          <p>영국: www.examrizzsearch.com</p>
          <p>주소: 164 Union Street, SE1 0LH</p>
        </div>
      </div>
    </div>
  )
}
