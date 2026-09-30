import { useEffect, useState } from 'react'

import {
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  UserPlus,
  RefreshCw,
  BarChart3
} from 'lucide-react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { Link } from 'react-router-dom'

import { getStudentStats } from '../services/studentService'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      const response = await getStudentStats()

      setStats(response?.data || null)
    } catch (err) {
      console.error('Dashboard error:', err)

      setError(
        err.message ||
        'Unable to load dashboard data.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  /* ======================================================
     INITIAL LOADING
     ====================================================== */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />

        <h3>Loading dashboard</h3>

        <p>
          Fetching the latest student statistics...
        </p>
      </div>
    )
  }

  /* ======================================================
     ERROR STATE
     ====================================================== */

  if (error && !stats) {
    return (
      <div className="dashboard-error">

        <div className="dashboard-error-icon">
          <BarChart3 size={22} />
        </div>

        <h3>
          Unable to load dashboard
        </h3>

        <p>
          {error}
        </p>

        <button
          type="button"
          className="retry-button"
          onClick={() => loadStats()}
        >
          <RefreshCw size={16} />
          Try Again
        </button>

      </div>
    )
  }

  /* ======================================================
     CHART DATA
     ====================================================== */

  const branchData =
    stats?.branchDistribution?.map(item => ({
      name: item.branch,
      students: item.count
    })) || []

  const semesterData =
    stats?.semesterDistribution?.map(item => ({
      name: `Sem ${item.semester}`,
      students: item.count
    })) || []

  const totalStudents =
    stats?.totalStudents ?? 0

  const averageCgpa =
    Number(stats?.averageCgpa ?? 0)

  const highestCgpa =
    Number(stats?.highestCgpa?.cgpa ?? 0)

  const lowestCgpa =
    Number(stats?.lowestCgpa?.cgpa ?? 0)

  return (
    <div className="dashboard-page">

      {/* ==================================================
          PAGE HEADER
          ================================================== */}

      <div className="page-header dashboard-header">

        <div>

          <p className="page-eyebrow">
            OVERVIEW
          </p>

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome back. Here's what's happening
            with your students.
          </p>

        </div>

        <div className="dashboard-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => loadStats(true)}
            disabled={refreshing}
            title="Refresh dashboard"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? 'refresh-spinning'
                  : ''
              }
            />

            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </button>

          <Link
            to="/students/add"
            className="primary-button"
          >
            <UserPlus size={17} />
            Add Student
          </Link>

        </div>

      </div>


      {/* ==================================================
          STATS CARDS
          ================================================== */}

      <div className="stats-grid">

        {/* TOTAL STUDENTS */}

        <div className="stat-card blue">

          <div className="stat-card-icon">
            <Users size={22} />
          </div>

          <div>

            <p>
              Total Students
            </p>

            <h2>
              {totalStudents}
            </h2>

            <span>
              Registered students
            </span>

          </div>

        </div>


        {/* AVERAGE CGPA */}

        <div className="stat-card green">

          <div className="stat-card-icon">
            <TrendingUp size={22} />
          </div>

          <div>

            <p>
              Average CGPA
            </p>

            <h2>
              {averageCgpa.toFixed(2)}
            </h2>

            <span>
              Overall performance
            </span>

          </div>

        </div>


        {/* HIGHEST CGPA */}

        <div className="stat-card purple">

          <div className="stat-card-icon">
            <Award size={22} />
          </div>

          <div>

            <p>
              Highest CGPA
            </p>

            <h2>
              {highestCgpa.toFixed(2)}
            </h2>

            <span>
              {stats?.highestCgpa?.name ||
                'No data'}
            </span>

          </div>

        </div>


        {/* LOWEST CGPA */}

        <div className="stat-card orange">

          <div className="stat-card-icon">
            <GraduationCap size={22} />
          </div>

          <div>

            <p>
              Lowest CGPA
            </p>

            <h2>
              {lowestCgpa.toFixed(2)}
            </h2>

            <span>
              {stats?.lowestCgpa?.name ||
                'No data'}
            </span>

          </div>

        </div>

      </div>


      {/* ==================================================
          MAIN DASHBOARD GRID
          ================================================== */}

      <div className="dashboard-grid">

        {/* BRANCH CHART */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>
                Students by Branch
              </h3>

              <p>
                Distribution across departments
              </p>

            </div>

            <span className="card-badge">
              {totalStudents}{' '}
              {totalStudents === 1
                ? 'Student'
                : 'Students'}
            </span>

          </div>

          <div className="chart-container">

            {branchData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={branchData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -10,
                    bottom: 5
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    cursor={{
                      fill: 'rgba(37, 99, 235, 0.05)'
                    }}
                  />

                  <Bar
                    dataKey="students"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    barSize={42}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="chart-empty">

                <BarChart3 size={28} />

                <p>
                  No branch data available
                </p>

              </div>

            )}

          </div>

        </div>


        {/* TOP PERFORMER */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>
                Top Performer
              </h3>

              <p>
                Highest CGPA in the system
              </p>

            </div>

            <Award size={20} />

          </div>


          {stats?.highestCgpa ? (

            <div className="top-performer">

              <div className="performer-avatar">
                {stats.highestCgpa.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {stats.highestCgpa.name}
              </h2>

              <span>
                ID: {stats.highestCgpa.studentId}
              </span>

              <div className="cgpa-highlight">

                <strong>
                  {Number(
                    stats.highestCgpa.cgpa
                  ).toFixed(2)}
                </strong>

                <span>
                  CGPA
                </span>

              </div>

            </div>

          ) : (

            <div className="chart-empty">

              <Award size={28} />

              <p>
                No student data available
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ==================================================
          SEMESTER DISTRIBUTION
          ================================================== */}

      <div className="dashboard-card semester-card">

        <div className="card-header">

          <div>

            <h3>
              Students by Semester
            </h3>

            <p>
              Student distribution across semesters
            </p>

          </div>

        </div>


        <div className="semester-list">

          {semesterData.length > 0 ? (

            semesterData.map(item => {

              const percentage =
                totalStudents > 0
                  ? (item.students /
                      totalStudents) *
                    100
                  : 0

              return (
                <div
                  className="semester-item"
                  key={item.name}
                >

                  <div className="semester-info">

                    <span className="semester-name">
                      {item.name}
                    </span>

                    <span className="semester-count">
                      {item.students}{' '}
                      {item.students === 1
                        ? 'student'
                        : 'students'}
                    </span>

                  </div>

                  <div className="semester-progress">

                    <div
                      style={{
                        width: `${percentage}%`
                      }}
                    />

                  </div>

                </div>
              )
            })

          ) : (

            <div className="chart-empty">

              <GraduationCap size={28} />

              <p>
                No semester data available
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ==================================================
          BACKGROUND ERROR NOTICE
          ================================================== */}

      {error && stats && (
        <div className="dashboard-refresh-warning">
          <RefreshCw size={15} />

          <span>
            Could not refresh the latest data.
            Showing the last available information.
          </span>
        </div>
      )}

    </div>
  )
}

export default Dashboard