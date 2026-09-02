import { useState, useMemo, useEffect, useRef, forwardRef } from 'react'

const SCI_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Mathematics': [
    { role: 'Data Scientist', description: 'Apply statistical modelling and machine learning to extract insight from large datasets.' },
    { role: 'Actuary', description: 'Assess financial risk for insurance, superannuation, and investment industries.' },
    { role: 'Operations Research Analyst', description: 'Optimise logistics, scheduling, and resource allocation for businesses and governments.' },
    { role: 'Quantitative Analyst', description: 'Develop pricing models and trading strategies in financial markets.' },
    { role: 'Cryptographer', description: 'Design and analyse secure communication systems for defence and technology sectors.' },
  ],
  'Statistics': [
    { role: 'Biostatistician', description: 'Design clinical trials and analyse health data for medical research organisations.' },
    { role: 'Market Research Analyst', description: 'Interpret survey data and consumer trends to guide business strategy.' },
    { role: 'Epidemiologist', description: 'Study the distribution and determinants of disease in human populations.' },
    { role: 'Data Analyst', description: 'Transform raw data into actionable reports across healthcare, finance, and government.' },
    { role: 'Actuary', description: 'Model uncertainty and financial risk for insurance and investment firms.' },
  ],
  'Mathematical Sciences': [
    { role: 'Academic Researcher', description: 'Advance theoretical knowledge in universities and research institutes.' },
    { role: 'Data Scientist', description: 'Build predictive models and analytical pipelines in industry settings.' },
    { role: 'Software Engineer', description: 'Apply formal methods and algorithmic thinking to software development.' },
    { role: 'Financial Modeller', description: 'Construct quantitative models for investment banks and fund managers.' },
  ],
  'Physics': [
    { role: 'Medical Physicist', description: 'Ensure safe and accurate delivery of radiation therapy and diagnostic imaging.' },
    { role: 'Materials Scientist', description: 'Develop new materials for aerospace, electronics, and renewable energy.' },
    { role: 'Research Physicist', description: 'Conduct experiments in particle physics, condensed matter, or optics.' },
    { role: 'Geophysicist', description: 'Use seismic and electromagnetic methods to explore the Earth\'s subsurface.' },
    { role: 'Data Scientist', description: 'Apply physics-trained analytical skills to large-scale data problems.' },
  ],
  'Astronomy': [
    { role: 'Astrophysicist', description: 'Study the physics of stars, galaxies, and cosmological phenomena.' },
    { role: 'Science Communicator', description: 'Translate complex discoveries for public audiences via media and outreach.' },
    { role: 'Observatory Technician', description: 'Maintain instrumentation and collect data at telescope facilities.' },
    { role: 'Data Analyst', description: 'Process large astronomical datasets from space-based observatories.' },
    { role: 'Defence Analyst', description: 'Apply orbital mechanics and signal processing to satellite and space operations.' },
  ],
  'Organic Chemistry': [
    { role: 'Pharmaceutical Chemist', description: 'Synthesise and evaluate drug candidates for major pharmaceutical companies.' },
    { role: 'Forensic Chemist', description: 'Identify chemical substances for law enforcement and legal proceedings.' },
    { role: 'Research Scientist', description: 'Develop new chemical compounds for agrochemical, polymer, or materials industries.' },
    { role: 'Quality Control Analyst', description: 'Validate product purity and consistency in manufacturing environments.' },
  ],
  'Inorganic Chemistry': [
    { role: 'Materials Scientist', description: 'Design advanced ceramics, alloys, and electronic materials.' },
    { role: 'Industrial Chemist', description: 'Optimise chemical manufacturing processes and reagent formulations.' },
    { role: 'Environmental Chemist', description: 'Monitor and remediate heavy metal contamination in soil and water.' },
    { role: 'Catalyst Developer', description: 'Create catalysts to improve efficiency of industrial chemical reactions.' },
  ],
  'Chemical Sciences': [
    { role: 'Industrial Chemist', description: 'Scale up and optimise chemical production processes.' },
    { role: 'Environmental Consultant', description: 'Assess and manage chemical contamination in industrial and natural sites.' },
    { role: 'Quality Control Manager', description: 'Oversee compliance, testing, and product standards in manufacturing.' },
    { role: 'Patent Examiner', description: 'Review chemical invention patents for intellectual property offices.' },
  ],
  'Atmospheric Sciences': [
    { role: 'Meteorologist', description: 'Produce weather forecasts for the public, aviation, agriculture, and defence.' },
    { role: 'Climate Scientist', description: 'Model long-term climate change and advise governments on mitigation.' },
    { role: 'Air Quality Analyst', description: 'Monitor atmospheric pollutants and support environmental regulation.' },
    { role: 'Emergency Management Officer', description: 'Coordinate responses to severe weather events and natural disasters.' },
  ],
  'Geology': [
    { role: 'Exploration Geologist', description: 'Locate and assess mineral and hydrocarbon deposits for mining companies.' },
    { role: 'Engineering Geologist', description: 'Evaluate ground conditions for infrastructure projects such as dams and tunnels.' },
    { role: 'Hydrogeologist', description: 'Investigate groundwater systems for water supply and contamination management.' },
    { role: 'Environmental Geologist', description: 'Assess geological hazards and land suitability for development.' },
  ],
  'Geophysics': [
    { role: 'Exploration Geophysicist', description: 'Use seismic, gravity, and magnetic surveys to locate mineral and oil deposits.' },
    { role: 'Seismologist', description: 'Study earthquakes and seismic hazard for government and research bodies.' },
    { role: 'Well Log Analyst', description: 'Interpret borehole geophysical data for oil and gas operations.' },
    { role: 'Mining Geophysicist', description: 'Support ore body delineation and underground mapping at mine sites.' },
  ],
  'Geochemistry': [
    { role: 'Exploration Geochemist', description: 'Analyse soil and rock samples to identify mineral prospects.' },
    { role: 'Environmental Chemist', description: 'Trace the movement of chemical contaminants through geological systems.' },
    { role: 'Volcanologist', description: 'Study volcanic gases and eruption products to assess hazard and inform research.' },
  ],
  'Soil Science': [
    { role: 'Agronomist', description: 'Advise farmers on soil health, crop nutrition, and sustainable land management.' },
    { role: 'Environmental Consultant', description: 'Assess soil contamination and remediation requirements on industrial sites.' },
    { role: 'Land Manager', description: 'Develop land use plans balancing agricultural productivity and conservation.' },
    { role: 'Soil Scientist', description: 'Conduct research into soil formation, classification, and ecosystem function.' },
  ],
  'Hydrology': [
    { role: 'Hydrologist', description: 'Analyse river flows, flood risk, and water availability for catchment management.' },
    { role: 'Water Resource Engineer', description: 'Design water supply, storage, and distribution infrastructure.' },
    { role: 'Environmental Consultant', description: 'Assess water quality and aquatic ecosystem impacts of development projects.' },
    { role: 'Flood Risk Analyst', description: 'Model flood scenarios and advise planners on risk-based land use.' },
  ],
  'Oceanography': [
    { role: 'Marine Scientist', description: 'Research ocean circulation, chemistry, and marine ecosystem health.' },
    { role: 'Climate Scientist', description: 'Model ocean-atmosphere interactions in global climate systems.' },
    { role: 'Environmental Consultant', description: 'Assess coastal and marine impacts of offshore development.' },
    { role: 'Fisheries Scientist', description: 'Study fish populations and advise on sustainable harvest quotas.' },
  ],
  'Earth Sciences': [
    { role: 'Environmental Consultant', description: 'Conduct environmental impact assessments for development and resource projects.' },
    { role: 'Field Geologist', description: 'Map and sample geological formations in remote and field environments.' },
    { role: 'Science Educator', description: 'Teach earth sciences in secondary schools and universities.' },
    { role: 'Natural Hazards Analyst', description: 'Assess earthquake, landslide, and volcanic risk for government agencies.' },
  ],
  'Biochemistry and Cell Biology': [
    { role: 'Pharmaceutical Researcher', description: 'Investigate drug mechanisms and develop therapeutic compounds.' },
    { role: 'Biotechnologist', description: 'Engineer biological systems for medical, agricultural, and industrial applications.' },
    { role: 'Medical Laboratory Scientist', description: 'Perform diagnostic testing in hospital and pathology lab settings.' },
    { role: 'Research Scientist', description: 'Conduct academic or industry research into cellular and molecular processes.' },
  ],
  'Botany': [
    { role: 'Botanist', description: 'Classify, study, and conserve plant species in field and laboratory settings.' },
    { role: 'Conservation Biologist', description: 'Develop strategies to protect threatened plant communities and ecosystems.' },
    { role: 'Agricultural Scientist', description: 'Improve crop varieties and yield through plant biology research.' },
    { role: 'Environmental Consultant', description: 'Conduct flora surveys and vegetation assessments for development approvals.' },
  ],
  'Ecology and Evolution': [
    { role: 'Ecologist', description: 'Study the relationships between organisms and their environments.' },
    { role: 'Conservation Manager', description: 'Plan and oversee wildlife reserves and national park programs.' },
    { role: 'Environmental Consultant', description: 'Conduct ecological impact assessments for planning and development projects.' },
    { role: 'Wildlife Researcher', description: 'Monitor and analyse animal populations and habitat requirements.' },
  ],
  'Marine Science': [
    { role: 'Marine Biologist', description: 'Research the biology and ecology of marine organisms and ecosystems.' },
    { role: 'Aquaculture Manager', description: 'Oversee the sustainable farming of fish, shellfish, and seaweed.' },
    { role: 'Environmental Consultant', description: 'Assess impacts of coastal development and marine infrastructure.' },
    { role: 'Reef Restoration Scientist', description: 'Design and implement coral restoration programs for degraded reefs.' },
  ],
  'Genetics': [
    { role: 'Genetic Counsellor', description: 'Guide patients and families through genetic testing and inherited disease risk.' },
    { role: 'Forensic Scientist', description: 'Analyse DNA evidence for law enforcement and court proceedings.' },
    { role: 'Biotechnologist', description: 'Develop genetically modified organisms or gene therapies for industry and medicine.' },
    { role: 'Research Scientist', description: 'Investigate genome structure, expression, and disease associations.' },
  ],
  'Microbiology': [
    { role: 'Microbiologist', description: 'Study bacteria, viruses, and fungi for medical, environmental, and industrial purposes.' },
    { role: 'Public Health Officer', description: 'Monitor and respond to infectious disease outbreaks in the community.' },
    { role: 'Food Safety Inspector', description: 'Enforce microbiological safety standards in food production and processing.' },
    { role: 'Clinical Microbiologist', description: 'Diagnose and advise on treatment of infectious diseases in hospital labs.' },
  ],
  'Human Biology': [
    { role: 'Medical Researcher', description: 'Conduct clinical and laboratory research into human health and disease.' },
    { role: 'Physiologist', description: 'Study how the human body functions at cellular, organ, and system levels.' },
    { role: 'Health Scientist', description: 'Apply biological knowledge in public health, epidemiology, or health policy.' },
    { role: 'Biomedical Researcher', description: 'Develop and test new medical technologies, drugs, and diagnostic tools.' },
  ],
  'Zoology': [
    { role: 'Wildlife Biologist', description: 'Study animal behaviour, ecology, and physiology in natural environments.' },
    { role: 'Conservation Officer', description: 'Protect and manage native fauna species and their habitats.' },
    { role: 'Zoo Curator', description: 'Oversee animal welfare, breeding programs, and education at zoological institutions.' },
    { role: 'Environmental Consultant', description: 'Conduct fauna surveys and wildlife impact assessments for development projects.' },
  ],
  'Biological Sciences': [
    { role: 'Research Scientist', description: 'Conduct laboratory or field research for government, university, or industry.' },
    { role: 'Environmental Consultant', description: 'Assess ecological impacts and develop mitigation strategies.' },
    { role: 'Science Educator', description: 'Teach biology in secondary schools, TAFEs, or universities.' },
    { role: 'Regulatory Affairs Officer', description: 'Navigate approval processes for biological products with regulatory agencies.' },
  ],
  'Medical Science': [
    { role: 'Medical Researcher', description: 'Design and conduct clinical trials and translational research programs.' },
    { role: 'Clinical Trials Coordinator', description: 'Manage the logistics and compliance of human clinical research studies.' },
    { role: 'Pharmaceutical Developer', description: 'Advance drug candidates from discovery through preclinical evaluation.' },
    { role: 'Pathologist', description: 'Diagnose disease through the examination of tissues and laboratory samples.' },
  ],
  'Forensic Science': [
    { role: 'Crime Scene Investigator', description: 'Collect and process physical evidence from crime scenes.' },
    { role: 'Forensic Analyst', description: 'Examine biological, chemical, and physical evidence in specialist labs.' },
    { role: 'Expert Witness', description: 'Present forensic findings and opinions in legal proceedings.' },
    { role: 'Disaster Victim Identification Officer', description: 'Identify human remains following mass casualty events.' },
  ],
  'Food Science and Biotechnology': [
    { role: 'Food Technologist', description: 'Develop, test, and improve food products for manufacturers and retailers.' },
    { role: 'Quality Assurance Manager', description: 'Maintain food safety and regulatory compliance across production facilities.' },
    { role: 'Product Developer', description: 'Create new food formulations to meet consumer and market demands.' },
    { role: 'Regulatory Affairs Officer', description: 'Secure approvals for new food ingredients and novel biotechnology products.' },
  ],
  'Pharmacology': [
    { role: 'Pharmacologist', description: 'Research how drugs interact with biological systems in preclinical settings.' },
    { role: 'Clinical Researcher', description: 'Design and monitor drug trials in hospital and research institute settings.' },
    { role: 'Regulatory Scientist', description: 'Prepare drug dossiers and navigate submissions to regulatory agencies.' },
    { role: 'Toxicologist', description: 'Evaluate the safety profile of chemicals and pharmaceuticals.' },
  ],
  'Laboratory Technology': [
    { role: 'Laboratory Technician', description: 'Operate equipment and conduct routine analyses in scientific labs.' },
    { role: 'Quality Control Analyst', description: 'Test raw materials and finished products to ensure specification compliance.' },
    { role: 'Medical Laboratory Technologist', description: 'Perform pathology testing supporting clinical diagnosis in hospitals.' },
    { role: 'Research Assistant', description: 'Support principal investigators in data collection and experimental procedures.' },
  ],
}

const IT_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Formal Language Theory': [
    { role: 'Compiler Engineer', description: 'Design and implement the front-end lexers, parsers, and type systems of programming language toolchains.' },
    { role: 'Programming Language Designer', description: 'Architect new languages and runtime semantics for research institutions or technology companies.' },
    { role: 'Cryptographer', description: 'Apply formal mathematical structures to build and verify secure communication protocols.' },
    { role: 'Verification Engineer', description: 'Use formal methods and model checking to prove the correctness of safety-critical software.' },
    { role: 'Academic Researcher', description: 'Advance automata theory, type theory, and computability research in universities.' },
  ],
  'Programming': [
    { role: 'Software Developer', description: 'Build and maintain applications across web, mobile, and desktop platforms.' },
    { role: 'Full Stack Engineer', description: 'Own both front-end interfaces and back-end services within product teams.' },
    { role: 'Mobile App Developer', description: 'Create native and cross-platform apps for iOS and Android using Swift, Kotlin, or React Native.' },
    { role: 'DevOps Engineer', description: 'Automate build, test, and deployment pipelines to accelerate software delivery.' },
    { role: 'Game Developer', description: 'Implement gameplay systems, physics engines, and rendering pipelines for video games.' },
  ],
  'Computational Theory': [
    { role: 'Algorithm Researcher', description: 'Design and analyse algorithms with provable efficiency guarantees for industry or academia.' },
    { role: 'Quantum Computing Researcher', description: 'Develop quantum algorithms and error-correction schemes for near-term quantum hardware.' },
    { role: 'Cryptographer', description: 'Construct and analyse public-key and post-quantum cryptographic systems.' },
    { role: 'Complexity Theorist', description: 'Investigate computational limits and problem classification in research institutions.' },
    { role: 'Data Scientist', description: 'Apply theoretical foundations of machine learning and optimisation to real-world datasets.' },
  ],
  'Compiler Construction': [
    { role: 'Compiler Engineer', description: 'Build optimising compilers targeting CPUs, GPUs, and custom hardware accelerators.' },
    { role: 'Toolchain Engineer', description: 'Maintain assemblers, linkers, and debuggers within platform or embedded ecosystems.' },
    { role: 'Embedded Systems Developer', description: 'Write low-level firmware and cross-compilation tooling for resource-constrained devices.' },
    { role: 'Programming Language Designer', description: 'Define language semantics and implement interpreters or JIT backends for new languages.' },
    { role: 'Static Analysis Engineer', description: 'Build linters and program analysis tools to detect bugs and security vulnerabilities at compile time.' },
  ],
  'Algorithms': [
    { role: 'Algorithm Engineer', description: 'Design high-performance algorithms for search, routing, scheduling, and optimisation problems.' },
    { role: 'Data Scientist', description: 'Apply algorithmic techniques to feature engineering, model selection, and data pipelines.' },
    { role: 'Quantitative Developer', description: 'Implement low-latency trading algorithms and market microstructure models for financial firms.' },
    { role: 'Software Engineer', description: 'Select and implement efficient data processing algorithms in product engineering teams.' },
    { role: 'Research Scientist', description: 'Develop novel algorithmic approaches published in top-tier computer science venues.' },
  ],
  'Data Structures': [
    { role: 'Systems Programmer', description: 'Implement memory-efficient and cache-friendly data structures for operating systems and databases.' },
    { role: 'Database Engineer', description: 'Design and optimise index structures, query execution engines, and storage layouts.' },
    { role: 'Performance Engineer', description: 'Profile and refactor data structure choices to eliminate bottlenecks in high-throughput systems.' },
    { role: 'Software Engineer', description: 'Apply appropriate data structures to solve product engineering problems effectively.' },
    { role: 'Embedded Systems Engineer', description: 'Manage memory and data layout on constrained microcontrollers and real-time systems.' },
  ],
  'Networks and Communications': [
    { role: 'Network Engineer', description: 'Design, configure, and maintain LAN, WAN, and data-centre network infrastructure.' },
    { role: 'Cloud Architect', description: 'Plan and implement scalable networking topologies across cloud platforms such as AWS or Azure.' },
    { role: 'Telecommunications Engineer', description: 'Design carrier-grade voice, data, and wireless network systems.' },
    { role: 'Security Engineer', description: 'Harden network perimeters, implement zero-trust architectures, and respond to intrusions.' },
    { role: 'Systems Administrator', description: 'Manage servers, switches, and firewalls to keep organisational IT infrastructure running.' },
  ],
  'Computer Graphics': [
    { role: 'Graphics Programmer', description: 'Write shaders, rendering pipelines, and GPU compute workloads for games and simulation.' },
    { role: 'Game Developer', description: 'Implement visual systems including lighting, post-processing, and animation in game engines.' },
    { role: 'Visual Effects Artist (Technical)', description: 'Bridge art and engineering in film and TV VFX pipelines using tools like Houdini or USD.' },
    { role: 'Computer Vision Engineer', description: 'Develop image processing and 3D reconstruction systems for robotics, AR, and medical imaging.' },
    { role: 'UI/UX Engineer', description: 'Build performant, visually rich interfaces applying graphics principles in web and native contexts.' },
  ],
  'Operating Systems': [
    { role: 'Kernel Developer', description: 'Contribute to Linux, Windows, or embedded RTOS kernels — schedulers, drivers, and memory management.' },
    { role: 'Systems Programmer', description: 'Write low-level C or Rust code for operating system internals, file systems, and IPC mechanisms.' },
    { role: 'Embedded Systems Engineer', description: 'Develop firmware and real-time operating environments for IoT and industrial devices.' },
    { role: 'Cloud Infrastructure Engineer', description: 'Build virtualisation layers, container runtimes, and hypervisors that power cloud platforms.' },
    { role: 'Site Reliability Engineer', description: 'Ensure system reliability, capacity planning, and incident response at scale for large platforms.' },
  ],
  'Artificial Intelligence': [
    { role: 'Machine Learning Engineer', description: 'Train, evaluate, and deploy machine learning models in production environments.' },
    { role: 'AI Researcher', description: 'Advance the state of the art in deep learning, reinforcement learning, or reasoning systems.' },
    { role: 'Natural Language Processing Engineer', description: 'Build language models, text classification, and information extraction systems.' },
    { role: 'Computer Vision Engineer', description: 'Develop object detection, segmentation, and image understanding pipelines.' },
    { role: 'Data Scientist', description: 'Apply predictive modelling and statistical learning to business and scientific problems.' },
  ],
  'Computer Science': [
    { role: 'Software Engineer', description: 'Design and build software systems across the full product and infrastructure stack.' },
    { role: 'Technical Lead', description: 'Guide engineering teams on architecture decisions and code quality standards.' },
    { role: 'Systems Architect', description: 'Define high-level technical blueprints for large-scale distributed systems.' },
    { role: 'Research Scientist', description: 'Conduct applied and fundamental research at technology companies or universities.' },
    { role: 'Chief Technology Officer', description: 'Set technology strategy and lead engineering organisations at executive level.' },
  ],
  'Conceptual Modelling': [
    { role: 'Business Analyst', description: 'Elicit requirements and translate them into structured process and data models.' },
    { role: 'Enterprise Architect', description: 'Align IT systems with business strategy using formal modelling frameworks such as TOGAF or ArchiMate.' },
    { role: 'Data Modeller', description: 'Design conceptual, logical, and physical data models to underpin database and data warehouse systems.' },
    { role: 'Systems Analyst', description: 'Analyse organisational workflows and specify information system requirements.' },
  ],
  'Database Management': [
    { role: 'Database Administrator', description: 'Manage relational and NoSQL databases, handling performance tuning, backups, and security.' },
    { role: 'Data Engineer', description: 'Build data pipelines, warehouses, and lakehouse architectures that feed analytics and ML systems.' },
    { role: 'Data Architect', description: 'Design enterprise-wide data platforms and govern data standards across the organisation.' },
    { role: 'Backend Developer', description: 'Implement server-side logic and database access layers for web and mobile applications.' },
    { role: 'Business Intelligence Developer', description: 'Build reporting databases, ETL processes, and dashboards for executive decision-making.' },
  ],
  'Systems Analysis and Design': [
    { role: 'Systems Analyst', description: 'Investigate operational requirements and design IT solutions that meet business needs.' },
    { role: 'Business Analyst', description: 'Bridge business stakeholders and technical teams to deliver well-specified software projects.' },
    { role: 'Solutions Architect', description: 'Design end-to-end technical solutions, selecting components, integrations, and platforms.' },
    { role: 'IT Consultant', description: 'Advise organisations on system selection, process improvement, and digital transformation.' },
    { role: 'Project Manager (IT)', description: 'Plan and deliver IT system implementations on time, within budget, and to specification.' },
  ],
  'Decision Support Systems': [
    { role: 'Business Intelligence Analyst', description: 'Design dashboards and reports that help executives make data-driven decisions.' },
    { role: 'Data Analyst', description: 'Interrogate datasets and surface trends that inform product and operational strategy.' },
    { role: 'Management Consultant', description: 'Advise senior leadership on strategy using data modelling and analytical frameworks.' },
    { role: 'BI Developer', description: 'Build and maintain data warehouses, ETL pipelines, and reporting tools such as Power BI or Tableau.' },
    { role: 'Product Analyst', description: 'Analyse user behaviour and product metrics to guide feature prioritisation.' },
  ],
  'Information Systems': [
    { role: 'IT Manager', description: 'Oversee technology operations, vendor relationships, and IT strategy for an organisation.' },
    { role: 'IT Consultant', description: 'Advise clients on ERP, CRM, and information system selection and implementation.' },
    { role: 'Systems Analyst', description: 'Evaluate and improve the performance and fit of enterprise information systems.' },
    { role: 'Business Analyst', description: 'Document processes and requirements for information system upgrades and replacements.' },
  ],
  'Security Science': [
    { role: 'Cybersecurity Analyst', description: 'Monitor networks and endpoints for threats, investigate incidents, and implement controls.' },
    { role: 'Penetration Tester', description: 'Conduct authorised ethical hacking engagements to uncover vulnerabilities before attackers do.' },
    { role: 'Security Architect', description: 'Design layered security frameworks for enterprise IT, cloud, and operational technology environments.' },
    { role: 'Incident Responder', description: 'Lead containment, eradication, and recovery efforts following cybersecurity breaches.' },
    { role: 'Chief Information Security Officer', description: 'Set organisational security strategy, risk appetite, and compliance posture at executive level.' },
  ],
  'Information Technology': [
    { role: 'IT Support Specialist', description: 'Provide technical support for hardware, software, and network issues across an organisation.' },
    { role: 'Systems Administrator', description: 'Manage servers, user accounts, and IT infrastructure to maintain operational continuity.' },
    { role: 'IT Manager', description: 'Lead IT teams, manage vendors, and align technology operations with business objectives.' },
    { role: 'IT Consultant', description: 'Advise organisations on technology adoption, process improvement, and digital transformation.' },
  ],
}

const ENG_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Manufacturing Engineering': [
    { role: 'Manufacturing Engineer', description: 'Design and optimise production lines, tooling, and assembly processes in industrial settings.' },
    { role: 'Process Improvement Engineer', description: 'Apply lean and Six Sigma methods to reduce waste and increase throughput.' },
    { role: 'Quality Engineer', description: 'Develop inspection systems and statistical process controls to maintain product standards.' },
    { role: 'Production Manager', description: 'Oversee daily manufacturing operations, scheduling, and workforce coordination.' },
    { role: 'Industrial Consultant', description: 'Advise manufacturers on automation, efficiency, and technology adoption.' },
  ],
  'Printing': [
    { role: 'Print Production Manager', description: 'Oversee scheduling, quality control, and equipment in commercial print facilities.' },
    { role: 'Prepress Technician', description: 'Prepare digital files, colour profiles, and plates for offset and digital printing.' },
    { role: 'Printing Equipment Technician', description: 'Maintain and repair offset, flexographic, and digital printing machinery.' },
    { role: 'Packaging Technologist', description: 'Design and produce packaging solutions for retail and industrial clients.' },
  ],
  'Textile Making': [
    { role: 'Textile Technologist', description: 'Develop and test fabrics for performance, durability, and aesthetic properties.' },
    { role: 'Knitting and Weaving Technician', description: 'Operate and maintain industrial looms and knitting machines in textile mills.' },
    { role: 'Quality Controller', description: 'Inspect fabrics and finished goods for defects and specification compliance.' },
    { role: 'Textile Product Developer', description: 'Collaborate with designers to bring new fabric concepts to market.' },
  ],
  'Garment Making': [
    { role: 'Pattern Maker', description: 'Create technical patterns for apparel production using manual and CAD methods.' },
    { role: 'Garment Technician', description: 'Ensure construction quality and fit specifications are met during production.' },
    { role: 'Fashion Production Coordinator', description: 'Manage sampling, factory liaison, and delivery timelines for clothing labels.' },
    { role: 'Alterations Tailor', description: 'Fit and alter garments for retail customers or bespoke commissions.' },
  ],
  'Footwear Making': [
    { role: 'Shoemaker', description: 'Construct bespoke or orthopaedic footwear using traditional lasting and stitching techniques.' },
    { role: 'Footwear Technician', description: 'Oversee materials sourcing, last fitting, and quality in footwear production.' },
    { role: 'Footwear Designer (Technical)', description: 'Translate design concepts into construction specifications and patterns.' },
  ],
  'Wood Machining and Turning': [
    { role: 'Wood Machinist', description: 'Operate CNC routers, lathes, and milling machines to produce timber components.' },
    { role: 'Pattern Maker (Foundry)', description: 'Create wooden patterns used as templates for metal casting in foundries.' },
    { role: 'Furniture Component Manufacturer', description: 'Produce precision-cut timber parts for flat-pack and bespoke furniture lines.' },
  ],
  'Cabinet Making': [
    { role: 'Cabinet Maker', description: 'Design and construct custom joinery, kitchens, and furniture for residential and commercial clients.' },
    { role: 'Shopfitter', description: 'Install custom joinery and display systems in retail and commercial interiors.' },
    { role: 'Furniture Restorer', description: 'Repair and refinish antique and contemporary furniture pieces.' },
    { role: 'Joinery Supervisor', description: 'Lead production teams in commercial joinery workshops.' },
  ],
  'Furniture Upholstery and Renovation': [
    { role: 'Upholsterer', description: 'Re-cover and restore furniture frames using foam, fabric, and leather.' },
    { role: 'Furniture Renovator', description: 'Repair, refinish, and repurpose domestic and commercial furniture.' },
    { role: 'Interior Fit-out Specialist', description: 'Install upholstered panels, seating, and soft furnishings in commercial spaces.' },
  ],
  'Furniture Polishing': [
    { role: 'Furniture Polisher', description: 'Apply lacquers, varnishes, stains, and oils to timber furniture and joinery.' },
    { role: 'Antique Restorer', description: 'Conserve and refinish heritage furniture using period-appropriate techniques.' },
    { role: 'Production Finisher', description: 'Operate spray booths and finishing lines in furniture manufacturing plants.' },
  ],
  'Chemical Engineering': [
    { role: 'Chemical Engineer', description: 'Design and optimise industrial processes for the production of chemicals, fuels, and pharmaceuticals.' },
    { role: 'Process Engineer', description: 'Improve plant performance, safety, and energy efficiency in manufacturing facilities.' },
    { role: 'Petroleum Engineer', description: 'Design extraction and refining systems for oil and gas operations.' },
    { role: 'Environmental Engineer', description: 'Develop treatment systems for industrial effluents, emissions, and waste streams.' },
    { role: 'Materials Scientist', description: 'Research and develop advanced materials for aerospace, electronics, and biomedical applications.' },
  ],
  'Mining Engineering': [
    { role: 'Mining Engineer', description: 'Plan and oversee the extraction of minerals from open-cut and underground mines.' },
    { role: 'Geotechnical Engineer', description: 'Assess slope stability and ground conditions to ensure safe mine operations.' },
    { role: 'Mine Planner', description: 'Develop short and long-term mine designs and production schedules.' },
    { role: 'Ventilation Engineer', description: 'Design underground airflow systems to maintain safe working conditions.' },
    { role: 'Metallurgist', description: 'Optimise ore processing and recovery circuits at mineral processing plants.' },
  ],
  'Materials Engineering': [
    { role: 'Materials Engineer', description: 'Develop and test metals, polymers, ceramics, and composites for industrial applications.' },
    { role: 'Failure Analysis Engineer', description: 'Investigate component failures to identify root causes and prevent recurrence.' },
    { role: 'Corrosion Engineer', description: 'Design protection systems and coatings to prevent material degradation in service.' },
    { role: 'Composites Engineer', description: 'Develop fibre-reinforced structures for aerospace, defence, and automotive sectors.' },
  ],
  'Food Processing Technology': [
    { role: 'Food Process Engineer', description: 'Design and optimise equipment and processes for food production at industrial scale.' },
    { role: 'Food Safety Manager', description: 'Implement HACCP systems and regulatory compliance in processing facilities.' },
    { role: 'Product Development Technologist', description: 'Create new food products from concept through to commercial production.' },
    { role: 'Quality Assurance Supervisor', description: 'Oversee testing and inspection programs across food manufacturing lines.' },
  ],
  'Automotive Engineering': [
    { role: 'Automotive Engineer', description: 'Design and develop vehicle systems including powertrains, chassis, and electronics.' },
    { role: 'Electric Vehicle Engineer', description: 'Develop battery management systems, motor controllers, and EV drivetrains.' },
    { role: 'NVH Engineer', description: 'Analyse and reduce noise, vibration, and harshness in vehicle design.' },
    { role: 'Crash Safety Engineer', description: 'Simulate and test vehicle structural performance to meet safety regulations.' },
  ],
  'Vehicle Mechanics': [
    { role: 'Automotive Technician', description: 'Diagnose and repair mechanical and electronic faults across a wide range of vehicles.' },
    { role: 'Workshop Foreman', description: 'Supervise technicians and manage workflow in a vehicle service or repair shop.' },
    { role: 'Fleet Maintenance Manager', description: 'Oversee preventative maintenance programs for large commercial vehicle fleets.' },
    { role: 'Diesel Mechanic', description: 'Service and repair heavy diesel engines in trucks, buses, and plant equipment.' },
  ],
  'Automotive Electrics and Electronics': [
    { role: 'Automotive Electrician', description: 'Diagnose and repair electrical systems, sensors, and ECUs in modern vehicles.' },
    { role: 'Auto Electrical Specialist', description: 'Install and calibrate advanced driver assistance and infotainment systems.' },
    { role: 'EV Technician', description: 'Service high-voltage battery packs, inverters, and charging systems in electric vehicles.' },
  ],
  'Automotive Vehicle Refinishing': [
    { role: 'Panel Painter', description: 'Apply primer, basecoat, and clearcoat finishes to vehicle bodies to factory standards.' },
    { role: 'Colour Matcher', description: 'Formulate and mix paint to achieve precise factory colour matches for repairs.' },
    { role: 'Detailing Specialist', description: 'Perform paint correction, ceramic coating, and high-end vehicle presentation work.' },
  ],
  'Automotive Body Construction': [
    { role: 'Body Builder', description: 'Fabricate and install custom vehicle bodies on truck and bus chassis.' },
    { role: 'Automotive Welder', description: 'Perform structural welding and fabrication on vehicle chassis and body components.' },
  ],
  'Panel Beating': [
    { role: 'Panel Beater', description: 'Repair collision-damaged vehicle bodies by reshaping metal panels and replacing components.' },
    { role: 'Estimator', description: 'Assess vehicle damage and prepare repair cost estimates for insurers and customers.' },
    { role: 'Workshop Manager', description: 'Manage smash repair operations, customer liaison, and insurance claims processing.' },
  ],
  'Upholstery and Vehicle Trimming': [
    { role: 'Vehicle Trimmer', description: 'Fit and repair interior trim, carpets, headliners, and custom upholstery in vehicles.' },
    { role: 'Marine Trimmer', description: 'Fabricate and install canvas covers, seat cushions, and interiors for boats.' },
    { role: 'Custom Upholstery Specialist', description: 'Create bespoke interiors for classic, luxury, and specialty vehicles.' },
  ],
  'Mechanical Engineering': [
    { role: 'Mechanical Engineer', description: 'Design and analyse machines, equipment, and thermal systems across diverse industries.' },
    { role: 'HVAC Engineer', description: 'Design heating, ventilation, and air conditioning systems for buildings and facilities.' },
    { role: 'Maintenance Engineer', description: 'Develop preventive maintenance strategies and manage equipment reliability.' },
    { role: 'Product Design Engineer', description: 'Lead concept-to-production development of mechanical consumer and industrial products.' },
    { role: 'Robotics Engineer', description: 'Design and integrate robotic systems for manufacturing and logistics automation.' },
  ],
  'Industrial Engineering': [
    { role: 'Industrial Engineer', description: 'Optimise production systems, workflows, and resource utilisation across manufacturing and services.' },
    { role: 'Supply Chain Engineer', description: 'Design efficient logistics networks and inventory control systems.' },
    { role: 'Ergonomics Consultant', description: 'Evaluate and redesign workplaces and products to reduce injury and improve human performance.' },
    { role: 'Simulation Analyst', description: 'Build discrete-event simulation models to evaluate and improve operational systems.' },
  ],
  'Toolmaking': [
    { role: 'Toolmaker', description: 'Fabricate precision cutting tools, dies, and moulds used in manufacturing.' },
    { role: 'Die and Mould Designer', description: 'Design injection mould tooling for plastics and metal casting processes.' },
    { role: 'CNC Machinist', description: 'Program and operate CNC machining centres to produce high-tolerance components.' },
  ],
  'Metal Fitting': [
    { role: 'Fitter and Turner', description: 'Assemble, align, and maintain mechanical plant and equipment on industrial sites.' },
    { role: 'Maintenance Fitter', description: 'Service rotating equipment including pumps, gearboxes, and compressors.' },
    { role: 'Instrument Fitter', description: 'Install and calibrate process instrumentation in refineries and processing plants.' },
  ],
  'Turning and Machining': [
    { role: 'CNC Machinist', description: 'Set up and operate computer-controlled lathes and mills to produce precision parts.' },
    { role: 'Toolroom Machinist', description: 'Produce precision components and gauges in high-accuracy toolroom environments.' },
    { role: 'Machining Supervisor', description: 'Lead machining teams, manage workloads, and ensure quality standards are met.' },
  ],
  'Sheetmetal Working': [
    { role: 'Sheetmetal Worker', description: 'Fabricate ductwork, enclosures, and structural components from steel and aluminium sheet.' },
    { role: 'HVAC Ductwork Fabricator', description: 'Produce and install ventilation ductwork systems in commercial buildings.' },
    { role: 'Metal Fabricator', description: 'Weld and form custom metalwork for construction, mining, and industrial clients.' },
  ],
  'Boilermaking and Welding': [
    { role: 'Boilermaker', description: 'Fabricate and repair pressure vessels, storage tanks, and structural steel components.' },
    { role: 'Coded Welder', description: 'Perform structural and pressure welds to international codes in construction and resources.' },
    { role: 'Welding Inspector', description: 'Assess weld quality using visual, radiographic, and ultrasonic inspection methods.' },
    { role: 'Structural Steel Fabricator', description: 'Produce beams, columns, and connections for building and bridge construction.' },
  ],
  'Metal Casting and Patternmaking': [
    { role: 'Foundry Worker', description: 'Operate casting furnaces and moulding equipment to produce metal castings.' },
    { role: 'Pattern Maker', description: 'Fabricate wooden, plastic, or metal patterns used to create sand and investment casting moulds.' },
    { role: 'Metallurgist', description: 'Control alloy composition and heat treatment to achieve required casting properties.' },
  ],
  'Precision Metalworking': [
    { role: 'Precision Machinist', description: 'Produce ultra-high-tolerance components for aerospace, medical, and defence applications.' },
    { role: 'Instrument Maker', description: 'Fabricate and calibrate scientific instruments and measurement devices.' },
    { role: 'Watchmaker / Horologist', description: 'Assemble, adjust, and repair fine mechanical timepieces and instruments.' },
  ],
  'Plant and Machine Operations': [
    { role: 'Plant Operator', description: 'Operate heavy plant equipment such as excavators, bulldozers, and loaders on construction sites.' },
    { role: 'Process Plant Operator', description: 'Monitor and control automated process equipment in chemical and mineral processing plants.' },
    { role: 'Crane Operator', description: 'Safely lift and position loads using mobile, tower, and overhead crane equipment.' },
  ],
  'Construction Engineering': [
    { role: 'Construction Engineer', description: 'Manage the technical delivery of building and civil infrastructure projects on site.' },
    { role: 'Site Engineer', description: 'Set out, inspect, and document construction works to ensure design compliance.' },
    { role: 'Project Engineer', description: 'Coordinate subcontractors, schedules, and budgets on civil construction projects.' },
    { role: 'Building Information Modelling Coordinator', description: 'Manage 3D models and digital workflows across multidiscipline design teams.' },
  ],
  'Structural Engineering': [
    { role: 'Structural Engineer', description: 'Design load-bearing elements of buildings, bridges, and other structures.' },
    { role: 'Façade Engineer', description: 'Specify and analyse cladding and curtain wall systems for high-rise buildings.' },
    { role: 'Bridge Engineer', description: 'Design and assess road and rail bridge structures for transport authorities.' },
    { role: 'Forensic Structural Engineer', description: 'Investigate structural failures and provide expert opinion in legal proceedings.' },
  ],
  'Building Services Engineering': [
    { role: 'Building Services Engineer', description: 'Design mechanical, electrical, and hydraulic systems for buildings.' },
    { role: 'Hydraulic Engineer', description: 'Design fire suppression, plumbing, and drainage systems for commercial buildings.' },
    { role: 'Electrical Services Engineer', description: 'Design power distribution, lighting, and communications systems in buildings.' },
    { role: 'Commissioning Engineer', description: 'Test and validate installed building systems to confirm they meet design specifications.' },
  ],
  'Water and Sanitary Engineering': [
    { role: 'Water Engineer', description: 'Design water supply, treatment, and reticulation infrastructure for urban and rural communities.' },
    { role: 'Wastewater Engineer', description: 'Design sewerage networks and treatment plants to manage effluent safely.' },
    { role: 'Hydraulic Engineer', description: 'Model and design drainage, flood mitigation, and stormwater management systems.' },
    { role: 'Utility Engineer', description: 'Plan and manage underground service corridors for water, gas, and communications.' },
  ],
  'Transport Engineering': [
    { role: 'Transport Engineer', description: 'Plan and design road, rail, and public transit networks to optimise movement of people and goods.' },
    { role: 'Traffic Engineer', description: 'Analyse traffic flows, design intersections, and develop road safety improvement schemes.' },
    { role: 'Rail Engineer', description: 'Design track alignments, signalling systems, and rail infrastructure.' },
    { role: 'Pavement Engineer', description: 'Design and evaluate road pavement structures for durability and performance.' },
  ],
  'Geotechnical Engineering': [
    { role: 'Geotechnical Engineer', description: 'Assess soil and rock properties to inform foundation and earthworks design.' },
    { role: 'Ground Improvement Specialist', description: 'Design and oversee soil stabilisation and reinforcement works.' },
    { role: 'Tunnelling Engineer', description: 'Plan and supervise excavation, support, and lining of underground tunnels.' },
    { role: 'Landslide Risk Analyst', description: 'Evaluate slope instability and design mitigation for high-risk terrain.' },
  ],
  'Ocean Engineering': [
    { role: 'Offshore Structural Engineer', description: 'Design platforms, jackets, and subsea infrastructure for oil and gas fields.' },
    { role: 'Subsea Engineer', description: 'Develop pipelines, manifolds, and wellhead systems for deepwater installations.' },
    { role: 'Coastal Engineer', description: 'Design seawalls, breakwaters, and beach nourishment schemes to manage coastal processes.' },
    { role: 'Marine Operations Engineer', description: 'Plan offshore installation, decommissioning, and heavy-lift marine operations.' },
  ],
  'Civil Engineering': [
    { role: 'Civil Engineer', description: 'Plan, design, and oversee construction of roads, bridges, dams, and water infrastructure.' },
    { role: 'Project Manager', description: 'Lead multidisciplinary teams to deliver major infrastructure projects on time and budget.' },
    { role: 'Design Engineer', description: 'Produce detailed engineering designs and drawings for civil infrastructure.' },
    { role: 'Resident Engineer', description: 'Represent the client or designer on site during construction of civil works.' },
  ],
  'Surveying': [
    { role: 'Land Surveyor', description: 'Establish legal property boundaries, produce cadastral plans, and support subdivision.' },
    { role: 'Engineering Surveyor', description: 'Set out and monitor civil and construction works with precision instruments.' },
    { role: 'Hydrographic Surveyor', description: 'Map the seabed and underwater structures for navigation and marine construction.' },
    { role: 'Spatial Data Analyst', description: 'Process GPS, LiDAR, and drone survey data for GIS and infrastructure planning.' },
  ],
  'Mapping Science': [
    { role: 'Cartographer', description: 'Design and produce maps for navigation, planning, and environmental management.' },
    { role: 'GIS Analyst', description: 'Analyse spatial datasets to support decision-making in government and industry.' },
    { role: 'Remote Sensing Analyst', description: 'Process satellite and aerial imagery to monitor land use, vegetation, and change.' },
    { role: 'Geodesist', description: 'Measure and model the shape and gravity field of the Earth for precise positioning.' },
  ],
  'Geomatic Engineering': [
    { role: 'Geomatic Engineer', description: 'Combine surveying, GIS, and remote sensing to capture and manage spatial information.' },
    { role: 'Spatial Information Manager', description: 'Govern enterprise spatial data assets and geospatial infrastructure.' },
    { role: 'LiDAR Specialist', description: 'Acquire and process airborne and terrestrial laser scanning datasets.' },
  ],
  'Electrical Engineering': [
    { role: 'Electrical Engineer', description: 'Design power generation, transmission, and distribution systems for utilities and industry.' },
    { role: 'Power Systems Engineer', description: 'Analyse and protect electricity networks against faults and instability.' },
    { role: 'Renewable Energy Engineer', description: 'Design solar, wind, and battery storage systems for grid and off-grid applications.' },
    { role: 'Control Systems Engineer', description: 'Design automated control and SCADA systems for industrial processes.' },
  ],
  'Electronic Engineering': [
    { role: 'Electronics Engineer', description: 'Design analog and digital circuits, PCBs, and embedded hardware for consumer and industrial products.' },
    { role: 'RF Engineer', description: 'Design radio frequency systems for telecommunications, radar, and wireless devices.' },
    { role: 'Embedded Systems Engineer', description: 'Develop firmware and hardware for microcontroller-based products.' },
    { role: 'Test and Measurement Engineer', description: 'Design automated test equipment and procedures for electronic manufacturing.' },
  ],
  'Computer Engineering': [
    { role: 'Hardware Engineer', description: 'Design computer processors, memory systems, and logic devices at chip and board level.' },
    { role: 'FPGA Engineer', description: 'Implement digital logic in field-programmable gate arrays for high-speed applications.' },
    { role: 'Systems on Chip Designer', description: 'Integrate processor cores, peripherals, and interconnects into custom silicon.' },
    { role: 'Embedded Software Engineer', description: 'Write low-level drivers and firmware closely coupled to hardware.' },
  ],
  'Communications Technologies': [
    { role: 'Telecommunications Engineer', description: 'Design and deploy mobile, fibre, and satellite network infrastructure.' },
    { role: 'Network Architect', description: 'Plan carrier-grade IP and optical transport networks.' },
    { role: 'Wireless Systems Engineer', description: 'Design 5G base stations, antennas, and spectrum management strategies.' },
    { role: 'Solutions Engineer', description: 'Pre-sales technical design of communications systems for enterprise customers.' },
  ],
  'Communications Equipment Installation and Maintenance': [
    { role: 'Cabler', description: 'Install structured cabling systems for data, voice, and AV in commercial buildings.' },
    { role: 'Field Service Technician', description: 'Commission and maintain telecommunications equipment at customer premises.' },
    { role: 'Tower Technician', description: 'Install and service antennas and radio equipment on mobile network towers.' },
  ],
  'Powerline Installation and Maintenance': [
    { role: 'Linesperson', description: 'Install, maintain, and repair overhead and underground electricity distribution networks.' },
    { role: 'Substation Technician', description: 'Commission and maintain high-voltage switchgear, transformers, and protection relays.' },
    { role: 'Cable Jointer', description: 'Terminate and splice high-voltage underground power cables.' },
  ],
  'Electrical Fitting': [
    { role: 'Electrician', description: 'Install and maintain wiring, switchboards, and electrical equipment in buildings.' },
    { role: 'Electrical Supervisor', description: 'Lead electrical installation crews on commercial and industrial construction sites.' },
    { role: 'Maintenance Electrician', description: 'Service and repair electrical systems and plant in manufacturing and resource operations.' },
  ],
  'Electrical Mechanics': [
    { role: 'Electromechanic', description: 'Repair and rewind electric motors, generators, and transformers.' },
    { role: 'Instrumentation Technician', description: 'Install and calibrate process sensors and control equipment in industrial plants.' },
  ],
  'Refrigeration and Air Conditioning Mechanics': [
    { role: 'Refrigeration Mechanic', description: 'Install and service commercial and industrial refrigeration systems.' },
    { role: 'HVAC Technician', description: 'Commission and maintain air conditioning systems in commercial buildings.' },
    { role: 'Cold Chain Specialist', description: 'Ensure refrigeration integrity across food and pharmaceutical supply chains.' },
  ],
  'Electronic Equipment Servicing': [
    { role: 'Electronics Technician', description: 'Diagnose and repair electronic equipment for industrial and consumer applications.' },
    { role: 'Avionics Technician', description: 'Maintain aircraft navigation, communication, and instrumentation systems.' },
    { role: 'Biomedical Equipment Technician', description: 'Service medical devices and diagnostic equipment in clinical settings.' },
  ],
  'Electrical and Electronic Engineering and Technology': [
    { role: 'Engineering Technologist', description: 'Apply electrical and electronic engineering principles in design, testing, and support roles.' },
    { role: 'Project Engineer', description: 'Coordinate technical delivery of electrical and electronic system installations.' },
  ],
  'Aerospace Engineering': [
    { role: 'Aerospace Engineer', description: 'Design aircraft, spacecraft, and propulsion systems to meet performance and safety requirements.' },
    { role: 'Structures Engineer', description: 'Analyse airframe and spacecraft structural integrity under flight loads.' },
    { role: 'Aerodynamicist', description: 'Simulate and optimise aircraft shapes for lift, drag, and stability performance.' },
    { role: 'Systems Integration Engineer', description: 'Ensure avionics, propulsion, and mechanical systems function together as designed.' },
  ],
  'Aircraft Maintenance Engineering': [
    { role: 'Licensed Aircraft Maintenance Engineer', description: 'Certify the airworthiness of commercial aircraft following regulatory maintenance.' },
    { role: 'Line Maintenance Technician', description: 'Perform pre-flight inspections and rectify defects to keep aircraft operational.' },
    { role: 'Avionics Engineer', description: 'Maintain and repair aircraft navigation, flight management, and communication systems.' },
    { role: 'Engine Overhaul Technician', description: 'Disassemble, inspect, and reassemble aircraft engines in approved workshops.' },
  ],
  'Aircraft Operation': [
    { role: 'Commercial Airline Pilot', description: 'Operate scheduled passenger and freight flights for commercial carriers.' },
    { role: 'Charter Pilot', description: 'Fly on-demand passenger and cargo missions for charter and charter freight operators.' },
    { role: 'Helicopter Pilot', description: 'Perform mustering, emergency services, offshore, and utility helicopter operations.' },
    { role: 'Flight Instructor', description: 'Train student pilots in a range of fixed-wing and rotary aircraft types.' },
  ],
  'Air Traffic Control': [
    { role: 'Air Traffic Controller', description: 'Direct aircraft movements within controlled airspace and at aerodromes to ensure safe separation.' },
    { role: 'Aeronautical Information Specialist', description: 'Produce and maintain charts, manuals, and digital data used in aviation navigation.' },
    { role: 'Aviation Safety Inspector', description: 'Audit airlines, airports, and maintenance organisations for regulatory compliance.' },
  ],
  'Aerospace Engineering and Technology': [
    { role: 'Aerospace Technologist', description: 'Support engineering teams in testing, prototype build, and data analysis.' },
    { role: 'Defence Systems Analyst', description: 'Evaluate aerospace system performance for military procurement and operations.' },
  ],
  'Maritime Engineering': [
    { role: 'Marine Engineer', description: 'Design ship propulsion, electrical, and auxiliary machinery systems.' },
    { role: 'Chief Engineer (Merchant Navy)', description: 'Manage and maintain all engineering systems aboard commercial vessels.' },
    { role: 'Naval Architect', description: 'Design vessel hulls, stability, and structure for commercial and defence applications.' },
    { role: 'Offshore Marine Engineer', description: 'Maintain mechanical and electrical systems on offshore platforms and vessels.' },
  ],
  'Marine Construction': [
    { role: 'Marine Fabricator', description: 'Weld and assemble steel structures for ships, offshore platforms, and port infrastructure.' },
    { role: 'Dock Manager', description: 'Oversee vessel repair, drydocking, and shipyard operations.' },
    { role: 'Project Manager (Shipbuilding)', description: 'Coordinate design, procurement, and construction of marine vessels.' },
  ],
  'Marine Craft Operation': [
    { role: 'Master Mariner', description: 'Command commercial vessels including container ships, tankers, and passenger ferries.' },
    { role: 'Marine Pilot', description: 'Navigate vessels safely through ports, harbours, and confined waterways.' },
    { role: 'Deck Officer', description: 'Stand navigational watches and manage cargo, safety, and crew on commercial ships.' },
    { role: 'Harbour Master', description: 'Oversee vessel movements, port safety, and regulatory compliance within a port precinct.' },
  ],
  'Maritime Engineering and Technology': [
    { role: 'Marine Surveyor', description: 'Inspect vessels for seaworthiness, classify compliance, and insurance assessment.' },
    { role: 'Port Operations Manager', description: 'Coordinate the movement of ships, cargo, and equipment across a working port.' },
  ],
  'Environmental Engineering': [
    { role: 'Environmental Engineer', description: 'Design systems to treat contaminated water, soil, and air across industrial and public sites.' },
    { role: 'Remediation Project Manager', description: 'Lead contaminated land assessment and cleanup programs.' },
    { role: 'Environmental Compliance Officer', description: 'Monitor industrial operations to ensure adherence to environmental licences and regulations.' },
  ],
  'Biomedical Engineering': [
    { role: 'Biomedical Engineer', description: 'Design medical devices including implants, diagnostic equipment, and therapeutic instruments.' },
    { role: 'Clinical Engineer', description: 'Manage and evaluate medical technology in hospital settings.' },
    { role: 'Regulatory Affairs Engineer', description: 'Navigate TGA and FDA approval processes for medical devices.' },
    { role: 'Rehabilitation Engineer', description: 'Develop assistive technologies and prosthetics to improve patient mobility and independence.' },
  ],
  'Fire Technology': [
    { role: 'Fire Protection Engineer', description: 'Design suppression, detection, and evacuation systems for buildings and infrastructure.' },
    { role: 'Fire Safety Consultant', description: 'Develop fire safety strategies and conduct risk assessments for complex buildings.' },
    { role: 'Fire Fighter (Technical)', description: 'Respond to structural and wildfire emergencies with specialist technical skills.' },
  ],
  'Rail Operations': [
    { role: 'Train Driver', description: 'Operate passenger and freight trains safely across metropolitan and regional networks.' },
    { role: 'Rail Network Controller', description: 'Manage train movements and network responses across a rail control centre.' },
    { role: 'Rolling Stock Maintainer', description: 'Inspect and service locomotives, railcars, and track maintenance equipment.' },
    { role: 'Rail Infrastructure Engineer', description: 'Maintain and upgrade track, signalling, and overhead wiring systems.' },
  ],
  'Cleaning': [
    { role: 'Commercial Cleaning Supervisor', description: 'Lead cleaning teams in offices, hospitals, and industrial facilities.' },
    { role: 'Hazmat Cleaning Specialist', description: 'Handle biohazardous, chemical, and crime scene decontamination work.' },
    { role: 'Facilities Manager', description: 'Oversee cleaning, maintenance, and service contracts for large building portfolios.' },
  ],
  'Engineering and Related Technologies': [
    { role: 'Engineering Technician', description: 'Support engineering teams with drafting, testing, and technical documentation.' },
    { role: 'Technical Sales Engineer', description: 'Apply engineering knowledge to advise clients and close technical product sales.' },
  ],
}

const ARCH_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Architecture': [
    { role: 'Architect', description: 'Design residential, commercial, and public buildings from concept through to construction completion.' },
    { role: 'Project Architect', description: 'Lead the design and documentation of individual building projects within a practice.' },
    { role: 'Design Architect', description: 'Drive the creative vision and spatial design of complex architectural projects.' },
    { role: 'Heritage Architect', description: 'Assess, conserve, and adaptively reuse historically significant buildings.' },
    { role: 'BIM Manager', description: 'Implement and govern building information modelling workflows across design teams.' },
  ],
  'Urban Design and Regional Planning': [
    { role: 'Urban Designer', description: 'Shape the physical form of streets, precincts, and public spaces in cities.' },
    { role: 'Town Planner', description: 'Prepare planning schemes and assess development applications for local and state government.' },
    { role: 'Regional Planner', description: 'Develop strategies for land use, transport, and housing at a regional scale.' },
    { role: 'Strategic Planner', description: 'Set long-range growth and infrastructure frameworks for metropolitan areas.' },
    { role: 'Development Assessment Officer', description: 'Evaluate planning permit applications against statutory and policy frameworks.' },
  ],
  'Landscape Architecture': [
    { role: 'Landscape Architect', description: 'Design parks, streetscapes, waterfronts, and open spaces for liveable communities.' },
    { role: 'Urban Greening Consultant', description: 'Advise on tree canopy, green roofs, and biophilic design strategies for cities.' },
    { role: 'Ecological Restoration Planner', description: 'Design habitat rehabilitation and revegetation programs for degraded landscapes.' },
    { role: 'Landscape Project Manager', description: 'Deliver public realm and open space construction projects within councils and agencies.' },
  ],
  'Interior and Environmental Design': [
    { role: 'Interior Designer', description: 'Design the spatial layout, materials, and atmosphere of residential and commercial interiors.' },
    { role: 'Workplace Designer', description: 'Create productive and flexible office environments that reflect organisational culture.' },
    { role: 'Retail Designer', description: 'Design brand-aligned shopping environments to maximise customer engagement.' },
    { role: 'Exhibition Designer', description: 'Develop spatial narratives and display environments for museums and galleries.' },
    { role: 'Environmental Graphic Designer', description: 'Integrate wayfinding, signage, and branding into architectural environments.' },
  ],
  'Architecture and Urban Environment': [
    { role: 'Design Consultant', description: 'Advise on the design quality and urban integration of major development projects.' },
    { role: 'Urban Regeneration Manager', description: 'Lead precinct renewal programs combining planning, design, and stakeholder engagement.' },
  ],
  'Building Science and Technology': [
    { role: 'Building Scientist', description: 'Investigate building physics issues including thermal comfort, moisture, and acoustics.' },
    { role: 'Sustainability Consultant', description: 'Advise on energy efficiency, green star ratings, and passive design strategies.' },
    { role: 'Building Diagnostics Specialist', description: 'Identify and resolve defects in existing buildings through technical investigation.' },
  ],
  'Building Construction Management': [
    { role: 'Construction Manager', description: 'Lead the on-site delivery of building projects from mobilisation through to handover.' },
    { role: 'Project Manager (Construction)', description: 'Manage budgets, programs, and stakeholders across building construction projects.' },
    { role: 'Contracts Administrator', description: 'Administer head and subcontract agreements, variations, and claims on building projects.' },
    { role: 'Developer', description: 'Originate, finance, and deliver residential and commercial real estate projects.' },
  ],
  'Building Surveying': [
    { role: 'Building Surveyor', description: 'Assess buildings for regulatory compliance, defects, and statutory certification.' },
    { role: 'Private Building Certifier', description: 'Approve building permits and inspect works on behalf of local or state government.' },
    { role: 'Dilapidation Consultant', description: 'Document building condition before and after adjacent construction to manage liability.' },
  ],
  'Building Construction Economics': [
    { role: 'Quantity Surveyor', description: 'Estimate, tender, and control costs across the full lifecycle of construction projects.' },
    { role: 'Cost Planner', description: 'Develop cost plans from early design concepts to support client decision-making.' },
    { role: 'Claims Consultant', description: 'Prepare and negotiate delay and variation claims on major construction contracts.' },
    { role: 'PPP Financial Analyst', description: 'Model the economics of public-private partnership infrastructure deals.' },
  ],
  'Bricklaying and Stonemasonry': [
    { role: 'Bricklayer', description: 'Lay bricks, blocks, and pavers for walls, pavements, and structural elements.' },
    { role: 'Stonemason', description: 'Cut, dress, and fix natural stone for heritage buildings, monuments, and feature elements.' },
    { role: 'Tuckpointer', description: 'Repoint and restore masonry joints in heritage and commercial buildings.' },
  ],
  'Carpentry and Joinery': [
    { role: 'Carpenter', description: 'Install framing, formwork, roofing, and finish carpentry on residential and commercial sites.' },
    { role: 'Joiner', description: 'Fabricate and install custom timber joinery, windows, doors, and staircases.' },
    { role: 'Formwork Carpenter', description: 'Construct temporary concrete formwork for structural slabs, columns, and walls.' },
    { role: 'Site Foreman', description: 'Supervise carpentry and construction crews on multi-trade building projects.' },
  ],
  'Ceiling, Wall and Floor Fixing': [
    { role: 'Ceiling and Wall Fixer', description: 'Install plasterboard, suspended ceilings, and partitioning in commercial buildings.' },
    { role: 'Flooring Installer', description: 'Lay timber, vinyl, and carpet floor coverings in residential and commercial projects.' },
    { role: 'Partitioning Installer', description: 'Erect demountable office and retail partitioning systems.' },
  ],
  'Roof Fixing': [
    { role: 'Roof Tiler', description: 'Lay concrete, terracotta, and slate roof tiles on residential and commercial buildings.' },
    { role: 'Metal Roofing Installer', description: 'Install standing-seam, corrugated, and longrun steel roof systems.' },
    { role: 'Roof Plumber', description: 'Install gutters, flashings, downpipes, and roof drainage systems.' },
  ],
  'Plastering': [
    { role: 'Solid Plasterer', description: 'Apply render, texture, and decorative finishes to building facades and interiors.' },
    { role: 'Fibrous Plasterer', description: 'Fabricate and install ornamental plasterwork, cornices, and heritage restoration features.' },
    { role: 'Renderer', description: 'Apply acrylic and cement render systems to residential and commercial exteriors.' },
  ],
  'Furnishing Installation': [
    { role: 'Furniture Installer', description: 'Assemble and install commercial and residential furniture systems.' },
    { role: 'Shopfitter', description: 'Install custom joinery, shelving, and display fixtures in retail environments.' },
    { role: 'Office Fit-out Coordinator', description: 'Manage the delivery and installation of furniture and fittings in workplace fit-outs.' },
  ],
  'Floor Coverings': [
    { role: 'Floor Layer', description: 'Install carpet, vinyl, timber, and resilient flooring in residential and commercial buildings.' },
    { role: 'Tiler', description: 'Fix ceramic, porcelain, and natural stone tiles in wet areas and feature spaces.' },
    { role: 'Floor Sanding and Polishing Specialist', description: 'Prepare and finish hardwood floors to a high-quality surface presentation.' },
  ],
  'Glazing': [
    { role: 'Glazier', description: 'Cut, handle, and install glass in windows, doors, facades, and shopfronts.' },
    { role: 'Curtain Wall Installer', description: 'Fix aluminium-framed glass curtain wall systems to high-rise commercial buildings.' },
    { role: 'Frameless Glass Specialist', description: 'Install structural glass balustrades, splashbacks, and feature elements.' },
  ],
  'Painting, Decorating and Sign Writing': [
    { role: 'Painter and Decorator', description: 'Prepare surfaces and apply paint, wallpaper, and protective coatings in buildings.' },
    { role: 'Protective Coatings Applicator', description: 'Apply industrial coatings to steel structures, pipelines, and marine assets.' },
    { role: 'Sign Writer', description: 'Design and apply hand-lettered, vinyl, and painted signage to buildings and vehicles.' },
  ],
  'Plumbing': [
    { role: 'Plumber', description: 'Install and maintain water supply, drainage, gas, and sanitary systems in buildings.' },
    { role: 'Gasfitter', description: 'Install and service natural gas and LPG appliances and distribution systems.' },
    { role: 'Fire Sprinkler Installer', description: 'Install and commission wet and dry fire sprinkler systems in commercial buildings.' },
    { role: 'Hydraulic Consultant', description: 'Design plumbing and fire services for complex building projects.' },
  ],
  'Scaffolding and Rigging': [
    { role: 'Scaffolder', description: 'Erect and dismantle access scaffolding for construction, maintenance, and events.' },
    { role: 'Rigger', description: 'Rig and move heavy loads using cranes, winches, and rigging hardware on construction sites.' },
    { role: 'Dogging and Crane Chasing', description: 'Direct crane lifts and attach rigging hardware as a licensed dogger on site.' },
  ],
  'Building': [
    { role: 'Builder (Licensed)', description: 'Hold a builder\'s licence to contract and deliver residential and commercial building works.' },
    { role: 'Site Supervisor', description: 'Coordinate trades, inspections, and programme on residential construction sites.' },
  ],
}

const AGRI_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Agricultural Science': [
    { role: 'Agronomist', description: 'Advise farmers on crop selection, soil health, irrigation, and pest management.' },
    { role: 'Agricultural Research Scientist', description: 'Develop improved varieties, farming systems, and technologies for primary industries.' },
    { role: 'Farm Manager', description: 'Plan and oversee all operations on cropping, grazing, or mixed farming enterprises.' },
    { role: 'Agricultural Consultant', description: 'Provide strategic and technical advice to farming businesses and agribusinesses.' },
    { role: 'Agricultural Extension Officer', description: 'Transfer research findings to farming communities through education and demonstration.' },
  ],
  'Wool Science': [
    { role: 'Wool Classer', description: 'Assess and classify wool clips to meet market specifications for sale and export.' },
    { role: 'Wool Broker', description: 'Market and sell wool on behalf of growers at auction and by private treaty.' },
    { role: 'Fibre Research Scientist', description: 'Investigate fibre properties and develop improved wool production and processing methods.' },
    { role: 'Animal Fibre Technologist', description: 'Apply fibre science in textile processing for wool, alpaca, and specialty fibres.' },
  ],
  'Animal Husbandry': [
    { role: 'Livestock Manager', description: 'Oversee breeding, nutrition, health, and welfare programs for cattle, sheep, or pigs.' },
    { role: 'Animal Nutritionist', description: 'Formulate diets and feeding strategies to maximise production and animal wellbeing.' },
    { role: 'Stud Manager', description: 'Manage genetic selection and breeding programs for pedigree livestock enterprises.' },
    { role: 'Feedlot Manager', description: 'Oversee intensive beef cattle feeding operations from induction to market weight.' },
  ],
  'Agriculture': [
    { role: 'Primary Producer', description: 'Own and operate a farming enterprise growing crops, raising livestock, or mixed farming.' },
    { role: 'Agribusiness Manager', description: 'Lead the commercial and operational functions of a large agricultural business.' },
    { role: 'Rural Banker / Agri Lender', description: 'Provide finance, credit assessment, and risk management services to the agricultural sector.' },
  ],
  'Horticulture': [
    { role: 'Horticulturalist', description: 'Manage the production of fruit, vegetables, ornamentals, and nursery stock.' },
    { role: 'Nursery Manager', description: 'Oversee plant propagation, growing programs, and retail operations at a nursery.' },
    { role: 'Viticulturalist', description: 'Manage vineyard operations including pruning, canopy management, and harvest.' },
    { role: 'Landscape Horticulturalist', description: 'Design and maintain commercial and residential garden spaces.' },
    { role: 'Urban Agriculture Specialist', description: 'Develop and manage urban farm projects, rooftop gardens, and community food systems.' },
  ],
  'Viticulture': [
    { role: 'Viticulturalist', description: 'Manage all aspects of vineyard establishment, canopy management, and harvest decisions.' },
    { role: 'Winemaker', description: 'Oversee fermentation, maturation, and blending to produce wines that reflect site and style.' },
    { role: 'Vineyard Manager', description: 'Coordinate labour, equipment, and growing programs across a commercial wine estate.' },
    { role: 'Wine Educator / Sommelier', description: 'Communicate wine knowledge in hospitality, retail, and educational contexts.' },
  ],
  'Forestry Studies': [
    { role: 'Forester', description: 'Manage forest resources for timber production, conservation, and multiple-use values.' },
    { role: 'Forest Ecologist', description: 'Study forest ecosystems and advise on biodiversity conservation and restoration.' },
    { role: 'Arborist', description: 'Assess, maintain, and safely remove trees in urban and rural environments.' },
    { role: 'Carbon Project Developer', description: 'Design and accredit forest-based carbon sequestration projects for voluntary and compliance markets.' },
    { role: 'Timber Harvesting Manager', description: 'Plan and supervise sustainable log harvesting operations in state and private forests.' },
  ],
  'Aquaculture': [
    { role: 'Aquaculture Farmer', description: 'Manage the intensive production of fish, shellfish, or algae in marine or freshwater systems.' },
    { role: 'Hatchery Manager', description: 'Oversee broodstock management, spawning, and juvenile rearing programs.' },
    { role: 'Aquaculture Technician', description: 'Monitor water quality, feeding regimes, and animal health on aquaculture sites.' },
    { role: 'Marine Aquaculture Consultant', description: 'Advise on site selection, species choice, and production system design.' },
  ],
  'Fisheries Studies': [
    { role: 'Fisheries Scientist', description: 'Assess fish stock health and advise on sustainable catch quotas and management measures.' },
    { role: 'Fisheries Officer', description: 'Enforce fisheries regulations and conduct compliance inspections at sea and on shore.' },
    { role: 'Marine Park Manager', description: 'Administer protected marine areas balancing conservation, recreation, and commercial use.' },
  ],
  'Land, Parks and Wildlife Management': [
    { role: 'Parks Ranger', description: 'Manage national park operations including visitor services, fire management, and conservation.' },
    { role: 'Wildlife Ranger', description: 'Monitor and protect native fauna, control pest species, and respond to wildlife incidents.' },
    { role: 'Land Manager', description: 'Develop and implement land use and conservation plans for public and private land.' },
    { role: 'Catchment Management Officer', description: 'Coordinate natural resource management programs across a river or coastal catchment.' },
  ],
  'Environmental Studies': [
    { role: 'Environmental Officer', description: 'Monitor environmental compliance and manage ecological impacts at industrial and development sites.' },
    { role: 'Sustainability Officer', description: 'Drive environmental performance improvement programs within organisations.' },
    { role: 'Environmental Educator', description: 'Develop and deliver conservation education programs for schools and community groups.' },
    { role: 'Climate Change Adaptation Planner', description: 'Assess risks from changing climate conditions and develop resilience strategies.' },
  ],
  'Pest and Weed Control': [
    { role: 'Pest Management Technician', description: 'Apply chemical and non-chemical methods to control insects, rodents, and other pests.' },
    { role: 'Weed Management Officer', description: 'Plan and implement invasive plant control programs on public and private land.' },
    { role: 'Biosecurity Officer', description: 'Inspect imports, monitor borders, and respond to exotic pest and disease incursions.' },
  ],
  'Agriculture, Environmental and Related Studies': [
    { role: 'Rural Consultant', description: 'Provide integrated advice on farming, environment, and land management.' },
    { role: 'Natural Resource Management Officer', description: 'Coordinate programs integrating agriculture, water, and biodiversity outcomes.' },
  ],
}

const HEALTH_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'General Medicine': [
    { role: 'General Practitioner', description: 'Provide comprehensive primary healthcare to patients of all ages in community clinic settings.' },
    { role: 'Hospitalist Physician', description: 'Manage acute inpatient medical care for a broad range of conditions in hospital.' },
    { role: 'Medical Researcher', description: 'Conduct clinical and translational research to advance the understanding and treatment of disease.' },
    { role: 'Medical Educator', description: 'Train and mentor medical students and junior doctors in universities and teaching hospitals.' },
  ],
  'Surgery': [
    { role: 'Surgeon', description: 'Perform operative procedures to treat disease, injury, and deformity across a chosen surgical specialty.' },
    { role: 'Surgical Registrar', description: 'Train in a surgical specialty under supervision in a hospital training program.' },
    { role: 'Surgical Research Fellow', description: 'Advance clinical knowledge through research alongside subspecialty surgical training.' },
  ],
  'Psychiatry': [
    { role: 'Psychiatrist', description: 'Diagnose and treat mental health disorders using medication, therapy, and multidisciplinary care.' },
    { role: 'Consultation-Liaison Psychiatrist', description: 'Provide psychiatric expertise to patients admitted for medical and surgical conditions.' },
    { role: 'Forensic Psychiatrist', description: 'Assess mental health in the context of criminal and civil legal proceedings.' },
    { role: 'Child and Adolescent Psychiatrist', description: 'Specialise in the diagnosis and treatment of mental disorders in young people.' },
  ],
  'Obstetrics and Gynaecology': [
    { role: 'Obstetrician and Gynaecologist', description: 'Provide care for pregnancy, childbirth, and disorders of the female reproductive system.' },
    { role: 'Maternal-Fetal Medicine Specialist', description: 'Manage high-risk pregnancies with complex medical or fetal complications.' },
    { role: 'Reproductive Endocrinologist', description: 'Treat infertility and hormonal disorders of the reproductive system.' },
  ],
  'Paediatrics': [
    { role: 'Paediatrician', description: 'Diagnose and manage medical conditions in infants, children, and adolescents.' },
    { role: 'Neonatologist', description: 'Provide intensive care for premature and critically ill newborn infants.' },
    { role: 'Paediatric Emergency Physician', description: 'Manage acute and life-threatening conditions in paediatric emergency departments.' },
  ],
  'Anaesthesiology': [
    { role: 'Anaesthetist', description: 'Administer anaesthesia and manage perioperative care for surgical and procedural patients.' },
    { role: 'Intensive Care Specialist', description: 'Provide life-sustaining care to critically ill patients in ICU environments.' },
    { role: 'Pain Medicine Specialist', description: 'Assess and treat patients with chronic and acute pain conditions.' },
  ],
  'Pathology': [
    { role: 'Pathologist', description: 'Diagnose disease by examining tissues, cells, and laboratory samples.' },
    { role: 'Haematologist', description: 'Diagnose and treat blood disorders including leukaemia, lymphoma, and clotting diseases.' },
    { role: 'Microbiologist (Clinical)', description: 'Identify infectious agents and guide antimicrobial therapy in hospital settings.' },
    { role: 'Genetic Pathologist', description: 'Apply genomic and molecular methods to diagnose inherited and acquired diseases.' },
  ],
  'Radiology': [
    { role: 'Radiologist', description: 'Interpret medical images including X-ray, CT, MRI, and ultrasound to diagnose disease.' },
    { role: 'Interventional Radiologist', description: 'Perform minimally invasive image-guided procedures to treat vascular and other conditions.' },
    { role: 'Nuclear Medicine Physician', description: 'Use radioactive tracers to image organ function and treat thyroid and cancer conditions.' },
  ],
  'Internal Medicine': [
    { role: 'Physician', description: 'Manage complex multi-system medical conditions in hospital and outpatient settings.' },
    { role: 'Cardiologist', description: 'Diagnose and treat disorders of the heart and cardiovascular system.' },
    { role: 'Gastroenterologist', description: 'Manage disorders of the gastrointestinal tract, liver, and pancreas.' },
    { role: 'Endocrinologist', description: 'Treat hormonal disorders including diabetes, thyroid disease, and metabolic conditions.' },
    { role: 'Rheumatologist', description: 'Diagnose and manage autoimmune and musculoskeletal diseases.' },
  ],
  'General Practice': [
    { role: 'General Practitioner', description: 'Provide ongoing, person-centred primary care in community clinic and rural settings.' },
    { role: 'Rural Generalist', description: 'Deliver comprehensive medical care including procedural skills in rural and remote communities.' },
    { role: 'GP Supervisor', description: 'Train and mentor GP registrars in accredited general practice training programs.' },
  ],
  'Medical Studies': [
    { role: 'Junior Medical Officer', description: 'Complete post-graduate training rotations across medical and surgical specialties in hospitals.' },
    { role: 'Medical Administrator', description: 'Combine clinical knowledge with management to lead health services and policy.' },
  ],
  'General Nursing': [
    { role: 'Registered Nurse', description: 'Deliver direct patient care in hospital wards, community health, and specialty settings.' },
    { role: 'Nurse Unit Manager', description: 'Lead and manage a clinical nursing team within a hospital ward or department.' },
    { role: 'Clinical Nurse Specialist', description: 'Provide expert nursing care and clinical leadership in a defined specialty area.' },
    { role: 'Nurse Practitioner', description: 'Practise at an advanced level with prescribing rights and autonomous clinical decision-making.' },
  ],
  'Midwifery': [
    { role: 'Midwife', description: 'Provide care and support to women throughout pregnancy, labour, birth, and the postnatal period.' },
    { role: 'Caseload Midwife', description: 'Follow a woman through her entire maternity journey as the primary caregiver.' },
    { role: 'Midwifery Educator', description: 'Teach student midwives in universities and clinical simulation environments.' },
  ],
  'Mental Health Nursing': [
    { role: 'Mental Health Nurse', description: 'Assess and provide therapeutic care to people experiencing mental illness in inpatient and community settings.' },
    { role: 'Crisis Assessment Nurse', description: 'Respond to acute mental health crises in emergency and community outreach settings.' },
    { role: 'Psychiatric Liaison Nurse', description: 'Support mental health needs of patients presenting to general hospital emergency departments.' },
  ],
  'Community Nursing': [
    { role: 'Community Health Nurse', description: 'Deliver nursing care and health education to individuals and families in their homes and community settings.' },
    { role: 'District Nurse', description: 'Provide wound care, chronic disease management, and post-acute support in the community.' },
    { role: 'School Nurse', description: 'Promote student health and wellbeing and manage health needs in school environments.' },
  ],
  'Critical Care Nursing': [
    { role: 'Intensive Care Nurse', description: 'Provide specialised nursing care for critically ill patients in ICU and high-dependency units.' },
    { role: 'Emergency Nurse', description: 'Triage, assess, and care for patients presenting with acute and emergency conditions.' },
    { role: 'Retrieval Nurse', description: 'Accompany critically ill patients during transport between health facilities.' },
  ],
  'Aged Care Nursing': [
    { role: 'Aged Care Nurse', description: 'Provide clinical care and support for older adults in residential and community aged care settings.' },
    { role: 'Dementia Care Specialist', description: 'Develop and lead person-centred care programs for people living with dementia.' },
    { role: 'Geriatric Nurse Practitioner', description: 'Manage complex health needs of older adults autonomously in aged care settings.' },
  ],
  'Palliative Care Nursing': [
    { role: 'Palliative Care Nurse', description: 'Support patients and families through end-of-life care with a focus on comfort and dignity.' },
    { role: 'Hospice Nurse', description: 'Deliver holistic care to dying patients within dedicated palliative care facilities.' },
    { role: 'Advance Care Planning Facilitator', description: 'Guide patients in documenting their wishes for future medical care.' },
  ],
  'Mothercraft Nursing and Family and Child Health Nursing': [
    { role: 'Child and Family Health Nurse', description: 'Support new parents with infant feeding, development, and family wellbeing.' },
    { role: 'Mothercraft Nurse', description: 'Provide intensive residential support for families experiencing parenting difficulties.' },
  ],
  'Nursing': [
    { role: 'Clinical Nurse Educator', description: 'Develop and deliver training programs for nursing staff across clinical settings.' },
    { role: 'Nursing Director', description: 'Lead nursing services at an organisational or system level within a health service.' },
  ],
  'Pharmacy': [
    { role: 'Community Pharmacist', description: 'Dispense medicines, counsel patients, and promote medication safety in retail pharmacy.' },
    { role: 'Hospital Pharmacist', description: 'Manage complex medication regimens and support clinical teams in hospital settings.' },
    { role: 'Clinical Pharmacist', description: 'Review medications for appropriateness, interactions, and therapeutic outcomes at the bedside.' },
    { role: 'Regulatory Affairs Pharmacist', description: 'Navigate drug approval processes with the TGA and other regulatory bodies.' },
    { role: 'Pharmacovigilance Scientist', description: 'Monitor post-market drug safety signals for pharmaceutical companies.' },
  ],
  'Dentistry': [
    { role: 'General Dentist', description: 'Provide preventive, restorative, and cosmetic dental care for patients of all ages.' },
    { role: 'Specialist Dentist', description: 'Practise in a recognised specialty such as orthodontics, oral surgery, or periodontics.' },
    { role: 'Public Health Dentist', description: 'Design and deliver population-level oral health programs and policy.' },
  ],
  'Dental Assisting': [
    { role: 'Dental Assistant', description: 'Support dentists during clinical procedures and manage patient care and infection control.' },
    { role: 'Dental Receptionist', description: 'Coordinate appointments, records, and patient communication in dental practices.' },
  ],
  'Dental Technology': [
    { role: 'Dental Technician', description: 'Fabricate crowns, bridges, dentures, and orthodontic appliances in a dental laboratory.' },
    { role: 'Maxillofacial Prosthetist', description: 'Create prosthetics to restore facial structures lost to cancer, trauma, or congenital conditions.' },
    { role: 'CAD/CAM Dental Technician', description: 'Design and mill digital dental restorations using computer-aided manufacturing systems.' },
  ],
  'Dental Studies': [
    { role: 'Oral Health Educator', description: 'Promote dental hygiene and preventive care across schools and community programs.' },
    { role: 'Dental Hygienist', description: 'Provide preventive dental care including scaling, fluoride, and patient education.' },
  ],
  'Optometry': [
    { role: 'Optometrist', description: 'Assess vision, diagnose eye disease, and prescribe corrective lenses and therapeutic agents.' },
    { role: 'Therapeutic Optometrist', description: 'Manage ocular disease and prescribe ophthalmic medications within an extended scope.' },
    { role: 'Paediatric Optometrist', description: 'Specialise in assessing and managing vision problems in children.' },
  ],
  'Optical Technology': [
    { role: 'Dispensing Optician', description: 'Fit and dispense spectacles and contact lenses based on optical prescriptions.' },
    { role: 'Optical Lab Technician', description: 'Grind, coat, and finish ophthalmic lenses in a dispensing laboratory.' },
  ],
  'Optical Science': [
    { role: 'Ophthalmic Scientist', description: 'Conduct research into vision, eye disease, and optical instruments.' },
    { role: 'Orthoptist', description: 'Assess and treat binocular vision disorders and assist in ophthalmic clinical settings.' },
  ],
  'Veterinary Science': [
    { role: 'Veterinarian', description: 'Diagnose, treat, and prevent disease in companion animals, livestock, and wildlife.' },
    { role: 'Veterinary Specialist', description: 'Practise at an advanced level in a recognised specialty such as surgery, oncology, or internal medicine.' },
    { role: 'Research Veterinarian', description: 'Conduct animal health and biomedical research in academic and government institutions.' },
    { role: 'Government Veterinary Officer', description: 'Administer biosecurity regulations and animal disease surveillance for government agencies.' },
  ],
  'Veterinary Assisting': [
    { role: 'Veterinary Nurse', description: 'Assist veterinarians with clinical procedures, patient care, and client communication.' },
    { role: 'Animal Attendant', description: 'Provide husbandry, feeding, and welfare care for animals in veterinary and boarding facilities.' },
  ],
  'Veterinary Studies': [
    { role: 'Animal Ethics Officer', description: 'Review and oversee the ethical use of animals in research under regulatory frameworks.' },
    { role: 'Biosecurity Inspector', description: 'Enforce animal import regulations and conduct disease surveillance at the border.' },
  ],
  'Occupational Health and Safety': [
    { role: 'WHS Officer', description: 'Identify hazards, implement controls, and maintain safety management systems in workplaces.' },
    { role: 'Safety Manager', description: 'Lead organisational safety culture, compliance, and incident investigation programs.' },
    { role: 'Ergonomist', description: 'Assess and redesign work environments to reduce musculoskeletal injury risk.' },
    { role: 'Hygienist', description: 'Monitor exposure to physical, chemical, and biological hazards in workplace environments.' },
  ],
  'Environmental Health': [
    { role: 'Environmental Health Officer', description: 'Investigate public health risks from food, water, waste, and built environment hazards.' },
    { role: 'Public Health Inspector', description: 'Audit food premises, public pools, and premises for regulatory compliance.' },
    { role: 'Air Quality Specialist', description: 'Monitor pollutants and advise on emission standards to protect community health.' },
  ],
  'Indigenous Health': [
    { role: 'Aboriginal Health Worker', description: 'Provide culturally safe primary health care and health promotion in Indigenous communities.' },
    { role: 'Indigenous Health Policy Analyst', description: 'Develop and evaluate programs to reduce health disparities for Aboriginal and Torres Strait Islander peoples.' },
    { role: 'Community Health Worker', description: 'Deliver preventive care, education, and care navigation in remote community settings.' },
  ],
  'Health Promotion': [
    { role: 'Health Promotion Officer', description: 'Plan and implement programs to improve health behaviours and reduce disease burden in communities.' },
    { role: 'Wellbeing Coordinator', description: 'Design and manage employee or community health and wellness programs.' },
    { role: 'Social Marketing Specialist', description: 'Create behaviour change campaigns targeting nutrition, physical activity, and chronic disease prevention.' },
  ],
  'Community Health': [
    { role: 'Community Health Worker', description: 'Deliver health education, screening, and care navigation to underserved populations.' },
    { role: 'Primary Health Care Nurse', description: 'Provide integrated care for chronic disease and preventive health in community settings.' },
    { role: 'Case Manager', description: 'Coordinate complex care plans for individuals with multiple health and social needs.' },
  ],
  'Epidemiology': [
    { role: 'Epidemiologist', description: 'Investigate disease distribution, risk factors, and outbreaks using population-level data.' },
    { role: 'Biostatistician', description: 'Design studies and analyse health data for government, universities, and research institutes.' },
    { role: 'Field Epidemiologist', description: 'Respond to infectious disease outbreaks, conduct contact tracing, and implement control measures.' },
    { role: 'Surveillance Analyst', description: 'Monitor disease trends in real-time using health notification and laboratory datasets.' },
  ],
  'Public Health': [
    { role: 'Public Health Officer', description: 'Protect and improve population health through policy, regulation, and community programs.' },
    { role: 'Health Policy Analyst', description: 'Evaluate health system performance and advise on policy reform.' },
    { role: 'Global Health Consultant', description: 'Work with international organisations to address health challenges in low-resource settings.' },
  ],
  'Radiography': [
    { role: 'Diagnostic Radiographer', description: 'Perform X-ray, CT, and other imaging procedures to assist medical diagnosis.' },
    { role: 'Radiation Therapist', description: 'Plan and deliver radiotherapy treatment to cancer patients under specialist direction.' },
    { role: 'Sonographer', description: 'Perform diagnostic ultrasound examinations across obstetric, cardiac, and musculoskeletal applications.' },
    { role: 'MRI Technologist', description: 'Operate magnetic resonance imaging equipment to produce diagnostic images.' },
  ],
  'Physiotherapy': [
    { role: 'Physiotherapist', description: 'Assess and treat physical impairments and pain through exercise, manual therapy, and rehabilitation.' },
    { role: 'Sports Physiotherapist', description: 'Provide injury assessment, management, and conditioning support to athletes.' },
    { role: 'Neurological Physiotherapist', description: 'Rehabilitate patients following stroke, brain injury, and spinal cord conditions.' },
    { role: 'Paediatric Physiotherapist', description: 'Manage developmental, neurological, and orthopaedic conditions in children.' },
  ],
  'Occupational Therapy': [
    { role: 'Occupational Therapist', description: 'Enable participation in daily activities for people with physical, cognitive, or psychosocial conditions.' },
    { role: 'Hand Therapist', description: 'Specialise in rehabilitation of upper limb injuries and post-surgical conditions.' },
    { role: 'Paediatric Occupational Therapist', description: 'Support children\'s sensory processing, fine motor, and daily living skill development.' },
    { role: 'Community Occupational Therapist', description: 'Conduct home assessments and prescribe assistive equipment for older adults and people with disability.' },
  ],
  'Chiropractic and Osteopathy': [
    { role: 'Chiropractor', description: 'Assess and treat musculoskeletal disorders with an emphasis on spinal manipulation.' },
    { role: 'Osteopath', description: 'Provide manual therapy for musculoskeletal pain and injury using a holistic approach.' },
  ],
  'Speech Pathology': [
    { role: 'Speech Pathologist', description: 'Assess and treat communication and swallowing disorders across the lifespan.' },
    { role: 'Paediatric Speech Pathologist', description: 'Support children with speech, language, fluency, and feeding difficulties.' },
    { role: 'Voice Therapist', description: 'Treat voice disorders in professional voice users and patients with laryngeal pathology.' },
  ],
  'Audiology': [
    { role: 'Audiologist', description: 'Assess hearing and balance disorders and fit hearing aids and cochlear implant devices.' },
    { role: 'Audiometrist', description: 'Conduct hearing tests and assist in hearing rehabilitation under audiologist supervision.' },
    { role: 'Paediatric Audiologist', description: 'Screen and manage hearing loss in newborns and children.' },
  ],
  'Massage Therapy': [
    { role: 'Remedial Massage Therapist', description: 'Treat musculoskeletal pain and injury through targeted soft tissue therapy.' },
    { role: 'Sports Massage Therapist', description: 'Support athlete preparation, performance, and recovery through massage techniques.' },
    { role: 'Myotherapist', description: 'Assess and treat chronic pain using advanced soft tissue and trigger point techniques.' },
  ],
  'Podiatry': [
    { role: 'Podiatrist', description: 'Diagnose and treat disorders of the foot, ankle, and lower limb.' },
    { role: 'Diabetes Podiatrist', description: 'Specialise in high-risk foot care and ulcer prevention for people with diabetes.' },
    { role: 'Sports Podiatrist', description: 'Assess biomechanical disorders and prescribe orthotics for athletic populations.' },
  ],
  'Rehabilitation Therapies': [
    { role: 'Rehabilitation Consultant', description: 'Coordinate injury recovery and return-to-work programs for workers compensation clients.' },
    { role: 'Allied Health Manager', description: 'Lead multidisciplinary allied health teams in hospitals and community health settings.' },
  ],
  'Naturopathy': [
    { role: 'Naturopath', description: 'Provide natural health consultation combining herbal medicine, nutrition, and lifestyle medicine.' },
    { role: 'Wellness Consultant', description: 'Advise on preventive health strategies in corporate or community wellness programs.' },
  ],
  'Acupuncture': [
    { role: 'Acupuncturist', description: 'Assess and treat health conditions using needling and traditional Chinese medicine principles.' },
    { role: 'Integrative Medicine Practitioner', description: 'Combine conventional and complementary approaches within an evidence-informed framework.' },
  ],
  'Traditional Chinese Medicine': [
    { role: 'Chinese Medicine Practitioner', description: 'Practise herbal medicine and acupuncture under AHPRA registration as a Chinese medicine practitioner.' },
    { role: 'Herbal Medicine Dispensary Manager', description: 'Manage the compounding and dispensing of Chinese herbal formulations.' },
  ],
  'Complementary Therapies': [
    { role: 'Complementary Health Practitioner', description: 'Provide natural therapies including aromatherapy, reflexology, or kinesiology.' },
    { role: 'Wellness Centre Manager', description: 'Oversee operations and practitioner teams in a complementary health business.' },
  ],
  'Nutrition and Dietetics': [
    { role: 'Dietitian', description: 'Assess nutritional status and develop evidence-based dietary plans for individuals and groups.' },
    { role: 'Clinical Nutritionist', description: 'Provide therapeutic nutrition support in hospital and outpatient settings.' },
    { role: 'Public Health Nutritionist', description: 'Design food policy and population-level nutrition programs.' },
    { role: 'Sports Dietitian', description: 'Optimise athlete nutrition for performance, recovery, and weight management goals.' },
  ],
  'Human Movement': [
    { role: 'Exercise Physiologist', description: 'Prescribe clinical exercise programs for chronic disease management and injury rehabilitation.' },
    { role: 'Strength and Conditioning Coach', description: 'Develop athletic performance through scientific training program design.' },
    { role: 'Physical Activity Coordinator', description: 'Promote and deliver physical activity programs in community and workplace settings.' },
  ],
  'Paramedical Studies': [
    { role: 'Paramedic', description: 'Respond to emergency calls and provide pre-hospital assessment and treatment.' },
    { role: 'Intensive Care Paramedic', description: 'Manage critical care patients in pre-hospital settings with advanced clinical skills.' },
    { role: 'Retrieval Paramedic', description: 'Transport and care for critically ill patients during air and road retrieval missions.' },
  ],
  'First Aid': [
    { role: 'First Aid Trainer', description: 'Teach CPR, first aid, and emergency response skills to community and workplace groups.' },
    { role: 'Workplace First Aid Officer', description: 'Respond to injuries and medical emergencies in occupational settings.' },
  ],
}

const EDU_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Teacher Education: Early Childhood': [
    { role: 'Early Childhood Teacher', description: 'Plan and deliver developmentally appropriate learning experiences for children aged 0–5 in kindergartens and preschools.' },
    { role: 'Childcare Centre Director', description: 'Manage the educational program and operations of a long day care or preschool service.' },
    { role: 'Early Intervention Specialist', description: 'Support children with developmental delays and disabilities in early years settings.' },
    { role: 'Curriculum Developer (Early Childhood)', description: 'Design learning frameworks and resources aligned with early childhood standards.' },
  ],
  'Teacher Education: Primary': [
    { role: 'Primary School Teacher', description: 'Teach a broad curriculum across literacy, numeracy, and key learning areas in Years K–6.' },
    { role: 'Learning Support Teacher', description: 'Provide targeted instruction for students with diverse learning needs in primary settings.' },
    { role: 'Instructional Coach', description: 'Support and develop classroom teachers through observation, feedback, and collaborative practice.' },
  ],
  'Teacher Education: Secondary': [
    { role: 'Secondary School Teacher', description: 'Teach one or more subjects to students in Years 7–12 in a specialist area.' },
    { role: 'Head of Department', description: 'Lead the curriculum, assessment, and professional development for a subject faculty.' },
    { role: 'Career Advisor', description: 'Guide secondary students in subject selection, pathways, and post-school transitions.' },
    { role: 'VCE/HSC Coordinator', description: 'Manage senior secondary programs, timetabling, and student results reporting.' },
  ],
  'Teacher-Librarianship': [
    { role: 'Teacher Librarian', description: 'Manage school library collections and integrate information literacy into the curriculum.' },
    { role: 'Digital Resources Coordinator', description: 'Curate and support the use of digital learning resources across a school.' },
  ],
  'Teacher Education: Vocational Education and Training': [
    { role: 'VET Teacher / Trainer', description: 'Deliver nationally recognised vocational training in TAFE institutes and RTOs.' },
    { role: 'Training Package Developer', description: 'Design competency-based curriculum and assessment tools for national VET qualifications.' },
    { role: 'RTO Manager', description: 'Oversee compliance, quality assurance, and operations of a registered training organisation.' },
  ],
  'Teacher Education: Higher Education': [
    { role: 'University Lecturer', description: 'Teach undergraduate and postgraduate courses and contribute to departmental research.' },
    { role: 'Academic Developer', description: 'Support university teaching staff to improve pedagogy and curriculum design.' },
    { role: 'Course Coordinator', description: 'Administer and continuously improve a university subject or program.' },
  ],
  'Teacher Education: Special Education': [
    { role: 'Special Education Teacher', description: 'Design and deliver individualised learning programs for students with disabilities.' },
    { role: 'Autism Support Teacher', description: 'Implement evidence-based strategies for students on the autism spectrum.' },
    { role: 'Early Intervention Specialist', description: 'Provide therapy-informed educational support to children with developmental delays.' },
    { role: 'Behaviour Support Practitioner', description: 'Develop positive behaviour support plans for students with complex needs.' },
  ],
  'English as a Second Language Teaching': [
    { role: 'ESL / EAL Teacher', description: 'Support English language acquisition for students from non-English-speaking backgrounds.' },
    { role: 'EFL Teacher (International)', description: 'Teach English as a Foreign Language at schools and language centres overseas.' },
    { role: 'TESOL Trainer', description: 'Prepare teachers to deliver English language instruction in diverse contexts.' },
    { role: 'Migrant English Program Coordinator', description: 'Manage government-funded English programs for newly arrived adult migrants.' },
  ],
  'Nursing Education Teacher Training': [
    { role: 'Nurse Educator', description: 'Design and deliver clinical training for nursing students and graduate nurses.' },
    { role: 'Clinical Facilitator', description: 'Supervise and assess nursing students during hospital clinical placements.' },
    { role: 'Simulation Educator', description: 'Design and debrief high-fidelity clinical simulation scenarios for healthcare students.' },
  ],
  'Teacher Education': [
    { role: 'Deputy Principal', description: 'Support school leadership, student welfare, and operational management.' },
    { role: 'Principal', description: 'Provide educational leadership and strategic direction for a school community.' },
    { role: 'Education Policy Analyst', description: 'Advise government on curriculum reform, assessment, and school improvement.' },
  ],
  'Curriculum Studies': [
    { role: 'Curriculum Officer', description: 'Develop and evaluate curriculum materials and assessment frameworks for education authorities.' },
    { role: 'Educational Publisher', description: 'Produce textbooks, digital resources, and assessment materials for school markets.' },
    { role: 'Curriculum Consultant', description: 'Advise schools and systems on curriculum alignment, design, and implementation.' },
  ],
  'Education Studies': [
    { role: 'Education Researcher', description: 'Investigate teaching practice, student outcomes, and policy effectiveness in academic settings.' },
    { role: 'Education Policy Adviser', description: 'Inform government and system decisions using evidence from education research.' },
    { role: 'Learning Designer', description: 'Create blended and online learning experiences for corporate and academic contexts.' },
  ],
  'Education': [
    { role: 'Education Consultant', description: 'Provide expert advice to schools, systems, and government on educational improvement.' },
    { role: 'Training and Development Manager', description: 'Lead organisational learning programs for corporate or public sector workforces.' },
  ],
}

const MGMT_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Accounting': [
    { role: 'Chartered Accountant', description: 'Provide financial reporting, audit, and advisory services to businesses and individuals.' },
    { role: 'Management Accountant', description: 'Analyse costs, budgets, and financial performance to support business decision-making.' },
    { role: 'Tax Advisor', description: 'Advise individuals and corporations on tax obligations, planning, and compliance.' },
    { role: 'Forensic Accountant', description: 'Investigate financial fraud, embezzlement, and disputes for legal proceedings.' },
    { role: 'Chief Financial Officer', description: 'Lead financial strategy, reporting, and risk management at executive level.' },
  ],
  'Business Management': [
    { role: 'General Manager', description: 'Oversee day-to-day operations and strategic direction of a business unit or company.' },
    { role: 'Business Analyst', description: 'Identify improvement opportunities and translate them into business and technology requirements.' },
    { role: 'Management Consultant', description: 'Advise organisations on strategy, operations, and change management.' },
    { role: 'Operations Manager', description: 'Coordinate people, processes, and resources to deliver efficient business operations.' },
  ],
  'Human Resource Management': [
    { role: 'HR Business Partner', description: 'Provide strategic people management support aligned to business unit objectives.' },
    { role: 'Talent Acquisition Specialist', description: 'Source, assess, and secure candidates to fill organisational roles.' },
    { role: 'Learning and Development Manager', description: 'Design and oversee employee training, capability development, and succession planning.' },
    { role: 'Industrial Relations Adviser', description: 'Manage enterprise bargaining, workplace disputes, and employment compliance.' },
    { role: 'Chief People Officer', description: 'Lead the people strategy, culture, and HR function at executive level.' },
  ],
  'Personal Management Training': [
    { role: 'Leadership Coach', description: 'Develop individual leaders through structured coaching engagements in corporate settings.' },
    { role: 'Career Counsellor', description: 'Guide individuals in career exploration, transition, and professional development planning.' },
    { role: 'Corporate Trainer', description: 'Deliver soft skills, leadership, and management development programs for organisations.' },
  ],
  'Organisation Management': [
    { role: 'Change Manager', description: 'Plan and lead organisational change programs to minimise disruption and build capability.' },
    { role: 'Organisational Development Consultant', description: 'Design interventions to improve culture, structure, and effectiveness in organisations.' },
    { role: 'Program Manager', description: 'Oversee a portfolio of interrelated projects delivering a strategic organisational outcome.' },
  ],
  'Industrial Relations': [
    { role: 'Industrial Relations Manager', description: 'Manage enterprise agreements, workplace disputes, and compliance with industrial legislation.' },
    { role: 'Employment Lawyer', description: 'Advise employers and employees on workplace rights, disputes, and dismissal claims.' },
    { role: 'Fair Work Commission Adviser', description: 'Represent organisations or workers in hearings before the Fair Work Commission.' },
  ],
  'International Business': [
    { role: 'International Trade Manager', description: 'Develop and manage export and import operations for global business.' },
    { role: 'Global Supply Chain Manager', description: 'Optimise end-to-end international supply chains for cost, speed, and resilience.' },
    { role: 'Country Manager', description: 'Lead operations and P&L for a multinational company\'s in-country business.' },
    { role: 'Trade and Investment Adviser', description: 'Support businesses entering new markets through government trade promotion agencies.' },
  ],
  'Public and Health Care Administration': [
    { role: 'Health Service Manager', description: 'Manage the operations, finances, and strategy of a hospital or health service.' },
    { role: 'Public Sector Manager', description: 'Lead policy implementation and service delivery within government agencies.' },
    { role: 'Healthcare Analyst', description: 'Use data and evidence to improve efficiency and outcomes in health services.' },
  ],
  'Project Management': [
    { role: 'Project Manager', description: 'Plan, execute, and close projects within scope, budget, and time constraints.' },
    { role: 'Program Manager', description: 'Coordinate multiple related projects to achieve strategic organisational goals.' },
    { role: 'PMO Analyst', description: 'Support project governance, reporting, and standards across a project management office.' },
    { role: 'Agile Coach', description: 'Guide organisations in adopting iterative delivery and continuous improvement practices.' },
  ],
  'Quality Management': [
    { role: 'Quality Manager', description: 'Implement and maintain quality management systems aligned with ISO and industry standards.' },
    { role: 'Process Improvement Specialist', description: 'Apply Lean, Six Sigma, and continuous improvement methods to reduce defects and waste.' },
    { role: 'Compliance Officer', description: 'Ensure organisational processes meet regulatory, industry, and contractual obligations.' },
    { role: 'Quality Auditor', description: 'Conduct internal and external audits of management systems and processes.' },
  ],
  'Hospitality Management': [
    { role: 'Hotel General Manager', description: 'Lead all operations of an accommodation property to achieve guest satisfaction and profitability.' },
    { role: 'Food and Beverage Manager', description: 'Oversee restaurant, bar, and catering operations within a hospitality venue.' },
    { role: 'Event Manager', description: 'Plan, organise, and deliver conferences, weddings, and corporate events.' },
    { role: 'Revenue Manager', description: 'Optimise room pricing and inventory strategies to maximise hotel revenue.' },
  ],
  'Farm Management and Agribusiness': [
    { role: 'Farm Manager', description: 'Plan and direct all production, financial, and human resources on a farming enterprise.' },
    { role: 'Agribusiness Analyst', description: 'Evaluate the financial and operational performance of agricultural businesses.' },
    { role: 'Rural Consultant', description: 'Advise farmers and agribusinesses on strategy, finance, and production management.' },
  ],
  'Tourism Management': [
    { role: 'Tourism Manager', description: 'Lead product development, marketing, and operations for tourism businesses or destinations.' },
    { role: 'Destination Manager', description: 'Coordinate tourism strategy and stakeholder engagement for a region or precinct.' },
    { role: 'Tour Operations Manager', description: 'Oversee the design and delivery of guided tour programs and travel products.' },
  ],
  'Business and Management': [
    { role: 'Entrepreneur', description: 'Establish and grow a business, managing risk and building value in a chosen market.' },
    { role: 'Strategy Consultant', description: 'Advise executive teams on competitive positioning, growth options, and market entry.' },
  ],
  'Sales': [
    { role: 'Sales Representative', description: 'Build client relationships and close product or service sales in a defined territory.' },
    { role: 'Account Manager', description: 'Manage ongoing relationships with key clients to retain and grow revenue.' },
    { role: 'Sales Manager', description: 'Lead a sales team, set targets, and develop strategies to achieve revenue goals.' },
    { role: 'Business Development Manager', description: 'Identify and pursue new market opportunities to expand the business.' },
  ],
  'Real Estate': [
    { role: 'Real Estate Agent', description: 'Market and sell residential and commercial properties on behalf of vendors.' },
    { role: 'Property Manager', description: 'Manage tenancy, maintenance, and landlord relations for investment properties.' },
    { role: 'Commercial Leasing Executive', description: 'Negotiate and manage leases for retail, office, and industrial commercial property.' },
    { role: 'Property Valuer', description: 'Assess market value of real estate for lending, insurance, and transaction purposes.' },
  ],
  'Marketing': [
    { role: 'Marketing Manager', description: 'Develop and execute marketing strategies to build brand awareness and drive demand.' },
    { role: 'Digital Marketing Specialist', description: 'Manage SEO, paid media, social, and email campaigns to generate leads and revenue.' },
    { role: 'Brand Manager', description: 'Protect and evolve a brand\'s positioning, identity, and consumer perception.' },
    { role: 'Content Strategist', description: 'Plan and oversee editorial content programs that attract and engage target audiences.' },
  ],
  'Advertising': [
    { role: 'Advertising Account Manager', description: 'Manage client relationships and campaign delivery at advertising agencies.' },
    { role: 'Media Buyer', description: 'Plan and purchase advertising space across TV, radio, print, and digital media.' },
    { role: 'Creative Director', description: 'Lead the creative vision and output of advertising campaigns across a range of media.' },
    { role: 'Programmatic Advertising Specialist', description: 'Manage automated digital ad buying platforms to optimise campaign performance.' },
  ],
  'Public Relations': [
    { role: 'PR Consultant', description: 'Build and protect client reputation through media relations, events, and strategic communications.' },
    { role: 'Communications Manager', description: 'Lead internal and external communications strategy for an organisation.' },
    { role: 'Media Spokesperson', description: 'Represent an organisation in media interactions on sensitive or high-profile issues.' },
    { role: 'Crisis Communications Adviser', description: 'Develop and manage communications responses to reputational emergencies.' },
  ],
  'Sales and Marketing': [
    { role: 'Commercial Manager', description: 'Oversee sales, marketing, and customer strategy to drive business growth.' },
    { role: 'Chief Marketing Officer', description: 'Lead the marketing function and brand strategy at executive level.' },
  ],
  'Tourism': [
    { role: 'Tourism Officer', description: 'Promote visitor attractions and coordinate tourism development for local government.' },
    { role: 'Travel Consultant', description: 'Design and book customised travel itineraries for leisure and corporate clients.' },
    { role: 'Ecotourism Guide', description: 'Lead nature-based tour experiences with a focus on conservation and interpretation.' },
  ],
  'Secretarial and Clerical Studies': [
    { role: 'Executive Assistant', description: 'Provide high-level administrative, diary, and communications support to senior executives.' },
    { role: 'Office Manager', description: 'Coordinate office operations, facilities, and administrative staff.' },
    { role: 'Legal Secretary', description: 'Provide specialised administrative support in legal practices and courts.' },
  ],
  'Keyboard Skills': [
    { role: 'Data Entry Officer', description: 'Accurately input and maintain data in organisational databases and records systems.' },
    { role: 'Administrative Assistant', description: 'Provide general typing, filing, and scheduling support in office environments.' },
  ],
  'Practical Computing Skills': [
    { role: 'Office Administrator', description: 'Manage correspondence, spreadsheets, and digital filing systems using productivity software.' },
    { role: 'IT Help Desk Officer', description: 'Assist staff with common software and hardware issues in organisational settings.' },
  ],
  'Office Studies': [
    { role: 'Records Manager', description: 'Implement and maintain document and records management systems in organisations.' },
    { role: 'Medical Receptionist', description: 'Manage appointments, billing, and patient records in medical practice settings.' },
  ],
  'Banking and Finance': [
    { role: 'Financial Analyst', description: 'Evaluate investment opportunities and prepare financial models and reports.' },
    { role: 'Relationship Manager (Banking)', description: 'Develop and manage lending and transaction banking relationships with corporate clients.' },
    { role: 'Treasury Analyst', description: 'Manage an organisation\'s cash, liquidity, and foreign exchange risk.' },
    { role: 'Mortgage Broker', description: 'Source and arrange home and investment loan solutions for retail clients.' },
  ],
  'Insurance and Actuarial Studies': [
    { role: 'Actuary', description: 'Model financial risk for insurance, superannuation, and investment funds using statistical methods.' },
    { role: 'Insurance Underwriter', description: 'Assess and price risk proposals for individual and commercial insurance policies.' },
    { role: 'Claims Manager', description: 'Oversee the assessment and settlement of insurance claims.' },
    { role: 'Risk Analyst', description: 'Identify and quantify financial and operational risks for insurance or corporate clients.' },
  ],
  'Investment and Securities': [
    { role: 'Stockbroker', description: 'Execute securities transactions and advise clients on equity investments.' },
    { role: 'Portfolio Manager', description: 'Manage investment portfolios to achieve client returns within a defined risk mandate.' },
    { role: 'Investment Banker', description: 'Advise on mergers, acquisitions, capital raisings, and financial restructuring.' },
    { role: 'Compliance Officer (Financial Services)', description: 'Ensure investment activities comply with ASIC regulations and firm policies.' },
  ],
  'Banking, Finance and Related Fields': [
    { role: 'Chief Financial Officer', description: 'Lead financial planning, reporting, and capital management at an executive level.' },
    { role: 'Financial Planner', description: 'Advise clients on wealth accumulation, superannuation, insurance, and retirement strategies.' },
  ],
  'Purchasing, Warehousing and Distribution': [
    { role: 'Procurement Manager', description: 'Source and negotiate supply agreements to deliver value, quality, and supply security.' },
    { role: 'Warehouse Manager', description: 'Oversee receiving, storage, picking, and dispatch operations in a distribution centre.' },
    { role: 'Supply Chain Analyst', description: 'Optimise inventory, transport, and distribution networks using data and modelling.' },
    { role: 'Logistics Coordinator', description: 'Arrange freight movements and manage carrier relationships for import and export shipments.' },
  ],
  'Valuation': [
    { role: 'Property Valuer', description: 'Determine the market value of real estate for purchase, sale, and mortgage lending.' },
    { role: 'Plant and Equipment Valuer', description: 'Assess the value of machinery, vehicles, and specialist equipment for insurance and finance.' },
    { role: 'Business Valuator', description: 'Value private companies and businesses for sale, dispute resolution, and tax purposes.' },
  ],
  'Management and Commerce': [
    { role: 'CEO / Managing Director', description: 'Lead an organisation\'s overall strategy, performance, and stakeholder relationships.' },
    { role: 'Board Director', description: 'Provide governance oversight and strategic guidance as a member of an organisation\'s board.' },
  ],
}

const SOC_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Political Science': [
    { role: 'Policy Analyst', description: 'Research and evaluate government policies and produce evidence-based recommendations.' },
    { role: 'Political Adviser', description: 'Provide strategic counsel and speech writing support to elected officials.' },
    { role: 'Diplomat', description: 'Represent and advance national interests in bilateral and multilateral settings.' },
    { role: 'Lobbyist', description: 'Advocate for industry or civil society interests before government and regulators.' },
    { role: 'Academic Researcher', description: 'Study political institutions, behaviour, and ideology in university settings.' },
  ],
  'Policy Studies': [
    { role: 'Policy Officer', description: 'Draft, review, and coordinate policy documents and submissions within government agencies.' },
    { role: 'Think Tank Analyst', description: 'Produce independent policy research and advocacy on social and economic issues.' },
    { role: 'Regulatory Affairs Manager', description: 'Engage with regulators and government to manage compliance and policy risk.' },
    { role: 'Public Affairs Manager', description: 'Manage an organisation\'s relationships with government, regulators, and the public.' },
  ],
  'Political Science and Policy Studies': [
    { role: 'Electoral Commissioner', description: 'Administer democratic elections and ensure the integrity of electoral processes.' },
    { role: 'Legislative Drafter', description: 'Write bills and regulations translating government policy into legal instruments.' },
  ],
  'Sociology': [
    { role: 'Social Researcher', description: 'Conduct qualitative and quantitative research into social issues, inequality, and behaviour.' },
    { role: 'Community Development Officer', description: 'Work with communities to identify needs and build local capacity and resources.' },
    { role: 'Social Policy Adviser', description: 'Inform government and NGO programs addressing poverty, housing, and inclusion.' },
    { role: 'Academic Sociologist', description: 'Teach and research social theory and empirical social science in universities.' },
  ],
  'Anthropology': [
    { role: 'Cultural Heritage Consultant', description: 'Assess and protect Indigenous and other cultural heritage in development contexts.' },
    { role: 'Ethnographer', description: 'Conduct immersive fieldwork to study human cultures and social practices.' },
    { role: 'International Development Consultant', description: 'Design and evaluate aid and development programs in low-income countries.' },
    { role: 'UX Researcher', description: 'Apply ethnographic methods to understand user behaviour and improve product design.' },
  ],
  'History': [
    { role: 'Historian', description: 'Research and write about past events and their significance for universities and publishing houses.' },
    { role: 'Archivist', description: 'Preserve, organise, and provide access to historical records and documents.' },
    { role: 'Heritage Consultant', description: 'Assess the historical significance of places and objects for planning and conservation.' },
    { role: 'Museum Curator', description: 'Develop collections, exhibitions, and public programs at museums and cultural institutions.' },
    { role: 'Documentary Researcher', description: 'Investigate and verify historical facts for film, television, and media productions.' },
  ],
  'Archaeology': [
    { role: 'Archaeologist', description: 'Excavate and analyse material remains of past human societies.' },
    { role: 'Cultural Heritage Manager', description: 'Protect and manage archaeological sites within planning and development frameworks.' },
    { role: 'Museum Curator', description: 'Care for archaeological collections and create public interpretation programs.' },
    { role: 'Forensic Archaeologist', description: 'Apply archaeological methods to locate and recover human remains in legal investigations.' },
  ],
  'Human Geography': [
    { role: 'Urban Planner', description: 'Shape the spatial development of cities through land use, transport, and housing policy.' },
    { role: 'GIS Analyst', description: 'Use spatial data and mapping tools to analyse geographic patterns and support planning.' },
    { role: 'Regional Development Officer', description: 'Promote economic and social development in regional and rural communities.' },
    { role: 'Environmental Impact Assessor', description: 'Evaluate the human and environmental consequences of proposed development.' },
  ],
  'Indigenous Studies': [
    { role: 'Indigenous Liaison Officer', description: 'Facilitate engagement between Aboriginal and Torres Strait Islander communities and organisations.' },
    { role: 'Indigenous Policy Analyst', description: 'Develop programs addressing health, education, and economic outcomes for First Nations peoples.' },
    { role: 'Cultural Heritage Officer', description: 'Protect and promote Aboriginal cultural heritage in government and community settings.' },
    { role: 'Community Development Worker', description: 'Support self-determination and capacity building in Indigenous communities.' },
  ],
  'Gender Specific Studies': [
    { role: 'Gender Equality Officer', description: 'Develop and implement workplace and community gender equity programs.' },
    { role: 'Social Policy Researcher', description: 'Analyse gender-based disparities in health, income, and opportunity to inform policy.' },
    { role: 'Domestic Violence Advocate', description: 'Support survivors of family violence through crisis response and legal navigation.' },
    { role: 'Diversity and Inclusion Manager', description: 'Build inclusive organisational cultures and reduce systemic barriers for marginalised groups.' },
  ],
  'Studies in Human Society': [
    { role: 'Research Officer (Government)', description: 'Gather and synthesise social science evidence to support policy development.' },
    { role: 'Community Researcher', description: 'Conduct participatory research with communities on issues affecting their wellbeing.' },
  ],
  'Social Work': [
    { role: 'Social Worker', description: 'Assess needs and provide support to individuals and families experiencing disadvantage and crisis.' },
    { role: 'Child Protection Worker', description: 'Investigate reports of abuse and neglect and coordinate family safety responses.' },
    { role: 'Mental Health Social Worker', description: 'Provide psychosocial support and care coordination within mental health services.' },
    { role: 'Hospital Social Worker', description: 'Assist patients with discharge planning, housing, and access to community services.' },
  ],
  "Children's Services": [
    { role: 'Child and Family Support Worker', description: 'Provide early intervention support to vulnerable families in home and community settings.' },
    { role: 'Family Preservation Worker', description: 'Work intensively with at-risk families to prevent child removal into out-of-home care.' },
    { role: 'Foster Care Coordinator', description: 'Recruit, train, and support foster and kinship care households.' },
  ],
  'Youth Work': [
    { role: 'Youth Worker', description: 'Engage and support young people through mentoring, programs, and case management.' },
    { role: 'Youth Justice Worker', description: 'Supervise and rehabilitate young people in the youth justice system.' },
    { role: 'School Welfare Officer', description: 'Provide wellbeing support and crisis intervention for students in school settings.' },
  ],
  'Care for the Aged': [
    { role: 'Aged Care Worker', description: 'Provide personal care, social support, and daily living assistance for older adults.' },
    { role: 'Aged Care Coordinator', description: 'Assess needs and manage home care packages for elderly clients in the community.' },
    { role: 'Lifestyle Coordinator', description: 'Plan and deliver social, recreational, and therapeutic activities in residential aged care.' },
  ],
  'Care for the Disabled': [
    { role: 'Disability Support Worker', description: 'Assist people with disability to achieve their goals and participate in community life.' },
    { role: 'Support Coordinator (NDIS)', description: 'Help NDIS participants navigate their plans and connect with appropriate service providers.' },
    { role: 'Behaviour Support Practitioner', description: 'Develop positive behaviour support strategies for people with complex support needs.' },
  ],
  'Residential Client Care': [
    { role: 'Residential Support Worker', description: 'Provide accommodation and daily living support in group homes and supported housing.' },
    { role: 'House Supervisor', description: 'Lead a residential care team and ensure quality of care for residents.' },
  ],
  'Counselling': [
    { role: 'Counsellor', description: 'Provide therapeutic support to individuals dealing with personal, emotional, and relational challenges.' },
    { role: 'Grief and Loss Counsellor', description: 'Support individuals through bereavement and significant life transitions.' },
    { role: 'Employee Assistance Program Counsellor', description: 'Deliver confidential counselling to employees through workplace EAP services.' },
    { role: 'School Counsellor', description: 'Support student mental health, wellbeing, and academic pathways in school settings.' },
  ],
  'Welfare Studies': [
    { role: 'Welfare Worker', description: 'Deliver casework, referrals, and support for individuals experiencing social disadvantage.' },
    { role: 'Community Services Manager', description: 'Lead a team delivering social welfare programs in the community sector.' },
  ],
  'Human Welfare Studies and Services': [
    { role: 'NGO Program Manager', description: 'Design and manage human services programs for non-government organisations.' },
    { role: 'Social Enterprise Manager', description: 'Lead organisations that combine commercial activity with social outcomes.' },
  ],
  'Psychology': [
    { role: 'Registered Psychologist', description: 'Assess and treat mental health, behavioural, and emotional conditions in clinical practice.' },
    { role: 'Organisational Psychologist', description: 'Improve workplace performance, selection, and culture using psychological science.' },
    { role: 'Forensic Psychologist', description: 'Apply psychological expertise in criminal justice, courts, and correctional settings.' },
    { role: 'Educational Psychologist', description: 'Assess learning difficulties and support student wellbeing in educational contexts.' },
    { role: 'Research Psychologist', description: 'Advance psychological science through academic or applied research programs.' },
  ],
  'Behavioural Science': [
    { role: 'Behaviour Analyst', description: 'Apply applied behaviour analysis to support individuals with developmental disabilities.' },
    { role: 'UX Researcher', description: 'Use behavioural insights to understand and improve user experience and product design.' },
    { role: 'Nudge Advisor', description: 'Design choice architectures and behavioural interventions for government and public health.' },
  ],
  'Business and Commercial Law': [
    { role: 'Commercial Lawyer', description: 'Advise businesses on contracts, transactions, and regulatory compliance.' },
    { role: 'In-house Counsel', description: 'Provide legal advice and risk management support within a corporation.' },
    { role: 'Corporate Governance Adviser', description: 'Advise boards and executives on legal duties and governance best practice.' },
  ],
  'Constitutional Law': [
    { role: 'Constitutional Lawyer', description: 'Advise on the division of powers, rights, and governmental authority under a constitution.' },
    { role: 'Government Solicitor', description: 'Represent and advise government agencies on public law and administrative decisions.' },
    { role: 'Academic (Constitutional Law)', description: 'Teach and research constitutional principles and their interpretation by courts.' },
  ],
  'Criminal Law': [
    { role: 'Criminal Defence Lawyer', description: 'Represent individuals charged with criminal offences in courts and tribunals.' },
    { role: 'Prosecutor', description: 'Present criminal cases on behalf of the state or commonwealth in court proceedings.' },
    { role: 'Legal Aid Solicitor', description: 'Provide funded legal representation to individuals who cannot afford private lawyers.' },
  ],
  'Family Law': [
    { role: 'Family Lawyer', description: 'Advise on separation, divorce, parenting arrangements, and property settlement.' },
    { role: 'Family Dispute Resolution Practitioner', description: 'Facilitate mediation between separating couples on parenting and property matters.' },
    { role: 'Child Representative', description: 'Represent the interests of children in family court proceedings.' },
  ],
  'International Law': [
    { role: 'International Lawyer', description: 'Advise on cross-border transactions, treaties, and disputes under international law.' },
    { role: 'Diplomat', description: 'Negotiate and implement international agreements on behalf of a national government.' },
    { role: 'Human Rights Lawyer', description: 'Advocate for individuals and groups whose rights have been violated under domestic or international law.' },
  ],
  'Taxation Law': [
    { role: 'Tax Lawyer', description: 'Advise on complex tax structuring, disputes, and compliance for individuals and corporations.' },
    { role: 'Tax Consultant', description: 'Provide tax planning and compliance advice to business and private clients.' },
    { role: 'Tax Inspector', description: 'Conduct audits and investigations of tax compliance within the Taxation Office.' },
  ],
  'Legal Practice': [
    { role: 'Solicitor', description: 'Provide legal advice, draft documents, and represent clients across a broad range of practice areas.' },
    { role: 'Barrister', description: 'Specialise in courtroom advocacy and provide independent legal opinion.' },
    { role: 'Paralegal', description: 'Assist lawyers with research, document management, and client communication.' },
    { role: 'Court Registrar', description: 'Administer court proceedings, manage filings, and support judicial officers.' },
  ],
  'Law': [
    { role: 'Judge or Magistrate', description: 'Preside over court proceedings and determine outcomes in civil and criminal matters.' },
    { role: 'Ombudsman Officer', description: 'Investigate complaints against government agencies and recommend remedies.' },
  ],
  'Justice Administration': [
    { role: 'Justice Administrator', description: 'Manage administrative processes and operations within courts and tribunals.' },
    { role: 'Corrective Services Officer', description: 'Supervise and rehabilitate offenders in custodial and community settings.' },
    { role: 'Victim Support Officer', description: 'Assist crime victims to navigate the justice system and access support services.' },
  ],
  'Legal Studies': [
    { role: 'Legal Research Officer', description: 'Provide legislative and case law research support to legal practitioners and policymakers.' },
    { role: 'Compliance Analyst', description: 'Monitor legal and regulatory obligations for corporations and government agencies.' },
  ],
  'Police Studies': [
    { role: 'Police Officer', description: 'Enforce laws, respond to incidents, conduct investigations, and protect community safety.' },
    { role: 'Detective', description: 'Investigate serious crimes including homicide, fraud, and organised crime.' },
    { role: 'Intelligence Analyst', description: 'Gather and interpret information to support law enforcement and counter-crime operations.' },
    { role: 'Border Force Officer', description: 'Enforce customs, immigration, and biosecurity laws at national borders.' },
  ],
  'Justice and Law Enforcement': [
    { role: 'Criminologist', description: 'Study crime patterns, offender behaviour, and justice policy for research and advisory roles.' },
    { role: 'Probation and Parole Officer', description: 'Supervise and support offenders released into the community on orders.' },
  ],
  'Librarianship and Information Management': [
    { role: 'Librarian', description: 'Manage collections, provide research assistance, and deliver programs in public, academic, or special libraries.' },
    { role: 'Knowledge Manager', description: 'Organise and govern organisational knowledge assets for efficient retrieval and use.' },
    { role: 'Records Manager', description: 'Implement information governance and records management frameworks in organisations.' },
    { role: 'Digital Archivist', description: 'Preserve and provide access to born-digital and digitised records for institutions.' },
  ],
  'Curatorial Studies': [
    { role: 'Museum Curator', description: 'Research, acquire, and interpret collections for public exhibitions and scholarship.' },
    { role: 'Gallery Manager', description: 'Oversee exhibition programming, operations, and audience engagement at an art gallery.' },
    { role: 'Collections Manager', description: 'Manage the storage, conservation, and documentation of museum or archive collections.' },
    { role: 'Exhibition Developer', description: 'Design the interpretive framework and content of museum and touring exhibitions.' },
  ],
  'Librarianship, Information Management and Curatorial Studies': [
    { role: 'Information Architect', description: 'Design the structure and findability of information in digital systems and websites.' },
    { role: 'Research Data Manager', description: 'Govern research datasets for compliance, sharing, and long-term preservation.' },
  ],
  'English Language': [
    { role: 'English Teacher', description: 'Teach English language and literature to students in schools and language centres.' },
    { role: 'ESL / EAL Teacher', description: 'Support English language acquisition for speakers of other languages.' },
    { role: 'Editor', description: 'Review, refine, and shape written content for publishers, media, and organisations.' },
    { role: 'Content Writer', description: 'Produce engaging written material for digital platforms, marketing, and media.' },
  ],
  'Northern European Languages': [
    { role: 'Translator', description: 'Convert written content between languages with accuracy and cultural sensitivity.' },
    { role: 'Interpreter', description: 'Provide spoken or signed language interpretation in legal, medical, and diplomatic settings.' },
    { role: 'Language Teacher', description: 'Teach a modern language in schools, universities, or language academies.' },
    { role: 'International Liaison Officer', description: 'Facilitate communication and partnerships across language and cultural boundaries.' },
  ],
  'Southern European Languages': [
    { role: 'Translator', description: 'Render legal, technical, and literary texts from Romance languages into English and vice versa.' },
    { role: 'Interpreter', description: 'Facilitate communication in health, legal, and community settings for language users.' },
    { role: 'Language Teacher', description: 'Teach Spanish, Italian, French, or Portuguese in educational settings.' },
    { role: 'Cultural Attaché', description: 'Promote cultural exchange and language education in diplomatic postings.' },
  ],
  'Eastern European Languages': [
    { role: 'Translator / Interpreter', description: 'Provide language services in Slavic and other Eastern European languages for government and industry.' },
    { role: 'Intelligence Analyst', description: 'Apply language skills to support national security and foreign affairs analysis.' },
    { role: 'International Affairs Specialist', description: 'Engage with governments and organisations in Eastern Europe for trade, diplomacy, and research.' },
  ],
  'Southwest Asian and North African Languages': [
    { role: 'Arabic Interpreter', description: 'Provide community and specialist interpreting in health, legal, and government settings.' },
    { role: 'Regional Affairs Analyst', description: 'Analyse political and social developments in the Middle East and North Africa.' },
    { role: 'Humanitarian Aid Worker', description: 'Deliver aid programs in Arabic and Farsi-speaking countries in conflict and post-conflict settings.' },
  ],
  'Southern Asian Languages': [
    { role: 'Hindi / Urdu Interpreter', description: 'Support South Asian community members in navigating health, legal, and government services.' },
    { role: 'International Business Liaison', description: 'Facilitate trade and investment between local and South Asian markets.' },
    { role: 'Development Program Officer', description: 'Implement aid and development projects in South Asian countries.' },
  ],
  'Southeast Asian Languages': [
    { role: 'Indonesian / Thai / Vietnamese Interpreter', description: 'Provide interpreting in commercial, legal, and community contexts.' },
    { role: 'Regional Trade Adviser', description: 'Support local businesses entering Southeast Asian markets.' },
    { role: 'Language Teacher', description: 'Teach Southeast Asian languages in schools and universities.' },
  ],
  'Eastern Asian Languages': [
    { role: 'Mandarin / Japanese / Korean Interpreter', description: 'Provide high-level language services in trade, diplomacy, and community settings.' },
    { role: 'International Business Manager', description: 'Manage commercial relationships with Chinese, Japanese, or Korean partners.' },
    { role: 'Language Teacher', description: 'Teach East Asian languages in secondary schools, universities, and community programs.' },
  ],
  'Indigenous Languages': [
    { role: 'Indigenous Language Revitalisation Worker', description: 'Support communities to document, teach, and preserve endangered Aboriginal languages.' },
    { role: 'Language Program Coordinator', description: 'Manage programs bringing First Nations language learning into schools and communities.' },
    { role: 'Linguist / Language Researcher', description: 'Document and analyse endangered indigenous languages in collaboration with communities.' },
  ],
  'Translating and Interpreting': [
    { role: 'NAATI Certified Translator', description: 'Translate written documents in accredited language pairs for government and private clients.' },
    { role: 'Conference Interpreter', description: 'Provide simultaneous interpretation at international conferences and diplomatic events.' },
    { role: 'Community Interpreter', description: 'Enable access to services for people from non-English-speaking backgrounds.' },
  ],
  'Linguistics': [
    { role: 'Computational Linguist', description: 'Apply linguistic analysis to train and evaluate natural language processing systems.' },
    { role: 'Forensic Linguist', description: 'Analyse language evidence in legal proceedings including voice identification and authorship.' },
    { role: 'Speech Pathologist', description: 'Assess and treat communication disorders informed by phonological and syntactic knowledge.' },
    { role: 'Language Researcher', description: 'Study language structure, acquisition, and change in academic settings.' },
  ],
  'Literature': [
    { role: 'Author', description: 'Write fiction, non-fiction, poetry, or drama for publication and performance.' },
    { role: 'Literary Editor', description: 'Shape manuscripts and develop author relationships at publishing houses.' },
    { role: 'Cultural Critic', description: 'Analyse literature and media for academic publications, journals, and newspapers.' },
    { role: 'Scriptwriter', description: 'Write screenplays and scripts for film, television, theatre, and digital media.' },
  ],
  'Language and Literature': [
    { role: 'Academic (Literature / Languages)', description: 'Teach and research language and literary studies in universities.' },
    { role: 'Publishing Professional', description: 'Work across editorial, rights, and marketing roles in book and digital publishing.' },
  ],
  'Philosophy': [
    { role: 'Academic Philosopher', description: 'Teach and conduct research in ethics, epistemology, metaphysics, and philosophy of mind.' },
    { role: 'Ethics Consultant', description: 'Advise organisations on ethical frameworks for AI, biomedical, and business decisions.' },
    { role: 'Policy Analyst', description: 'Apply philosophical reasoning to analyse and critique public policy and governance.' },
  ],
  'Religious Studies': [
    { role: 'Chaplain', description: 'Provide pastoral and spiritual care in hospitals, schools, prisons, and military settings.' },
    { role: 'Interfaith Dialogue Facilitator', description: 'Promote understanding and cooperation between different religious communities.' },
    { role: 'Religious Education Teacher', description: 'Teach comparative religion and faith studies in schools and universities.' },
  ],
  'Philosophy and Religious Studies': [
    { role: 'Bioethicist', description: 'Provide ethical guidance on clinical, research, and policy decisions in health settings.' },
    { role: 'NGO Advocate', description: 'Apply values-based reasoning to human rights, social justice, and development advocacy.' },
  ],
  'Economics': [
    { role: 'Economist', description: 'Analyse markets, policies, and economic data to advise government and industry.' },
    { role: 'Economic Analyst', description: 'Produce research and forecasts on macroeconomic conditions and policy impacts.' },
    { role: 'Competition Lawyer / Economist', description: 'Advise on mergers, market power, and competition regulation.' },
    { role: 'Development Economist', description: 'Design and evaluate economic development programs in low-income countries.' },
  ],
  'Econometrics': [
    { role: 'Econometrician', description: 'Apply statistical models to economic data to estimate relationships and test hypotheses.' },
    { role: 'Data Scientist (Economics)', description: 'Use large datasets and machine learning to answer economic questions.' },
    { role: 'Risk Modeller', description: 'Build quantitative models for financial, credit, and market risk management.' },
  ],
  'Economics and Econometrics': [
    { role: 'Treasury Official', description: 'Advise government on fiscal policy, budget strategy, and economic forecasting.' },
    { role: 'Central Bank Analyst', description: 'Monitor economic indicators and model monetary policy impacts for a reserve bank.' },
  ],
  'Sport and Recreation Activities': [
    { role: 'Recreation Officer', description: 'Plan and deliver sport and leisure programs for community organisations and councils.' },
    { role: 'Sport Development Officer', description: 'Grow participation and capability in a sport through club and community programs.' },
    { role: 'Outdoor Education Leader', description: 'Facilitate adventure and nature-based recreational activities for schools and groups.' },
  ],
  'Sports Coaching, Officiating and Instruction': [
    { role: 'Sports Coach', description: 'Develop athlete skills, fitness, and tactics at grassroots, state, or elite level.' },
    { role: 'Sports Official / Referee', description: 'Apply the rules of a sport fairly and consistently in competition settings.' },
    { role: 'Physical Education Teacher', description: 'Deliver PE and health education to students in schools.' },
    { role: 'High Performance Coach', description: 'Prepare elite athletes for national and international competition in a specialist sport.' },
  ],
  'Sport and Recreation': [
    { role: 'Sports Administrator', description: 'Manage the governance, operations, and events of a sporting club or national federation.' },
    { role: 'Facility Manager (Sport and Leisure)', description: 'Operate aquatic centres, gyms, and sporting venues for councils or private operators.' },
  ],
  'Family and Consumer Studies': [
    { role: 'Family Support Worker', description: 'Provide practical and emotional support to families experiencing stress or disadvantage.' },
    { role: 'Consumer Advocate', description: 'Represent the interests of consumers in policy, dispute resolution, and education.' },
    { role: 'Home Economics Teacher', description: 'Teach food, textiles, and life skills in secondary school settings.' },
  ],
  'Criminology': [
    { role: 'Criminologist', description: 'Research crime, offending, and justice to inform policy, prevention, and rehabilitation programs.' },
    { role: 'Crime Prevention Officer', description: 'Design situational and social crime prevention strategies for councils and police.' },
    { role: 'Policy Analyst (Justice)', description: 'Evaluate criminal justice policy on sentencing, corrections, and victim support.' },
  ],
  'Security Services': [
    { role: 'Security Consultant', description: 'Assess physical and personnel security risks and develop protective strategies.' },
    { role: 'Close Protection Officer', description: 'Provide personal protection services to high-profile individuals and executives.' },
    { role: 'Corporate Security Manager', description: 'Oversee security operations, incident response, and risk management for an organisation.' },
  ],
  'Society and Culture': [
    { role: 'Social Entrepreneur', description: 'Found and lead organisations that address social problems through innovative approaches.' },
    { role: 'Community Development Manager', description: 'Lead community engagement and program delivery for councils and NGOs.' },
  ],
}

const ARTS_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Music': [
    { role: 'Performing Musician', description: 'Perform live and in recordings across classical, jazz, popular, or contemporary music genres.' },
    { role: 'Music Teacher', description: 'Provide individual and group instrumental or vocal tuition in schools and private studios.' },
    { role: 'Composer', description: 'Write original music for film, television, theatre, concert performance, and media.' },
    { role: 'Music Producer', description: 'Oversee the recording, arrangement, and technical production of music releases.' },
    { role: 'Arts Administrator (Music)', description: 'Manage programming, touring, and operations for orchestras, venues, and music festivals.' },
  ],
  'Drama and Theatre Studies': [
    { role: 'Actor', description: 'Perform roles in theatre, film, television, and digital media productions.' },
    { role: 'Theatre Director', description: 'Interpret scripts and lead the creative realisation of theatrical productions.' },
    { role: 'Drama Teacher', description: 'Teach dramatic arts and performance skills in schools and performing arts institutions.' },
    { role: 'Playwright', description: 'Write original scripts and dramatic works for stage and screen.' },
    { role: 'Stage Manager', description: 'Coordinate all logistical and technical elements of live theatre productions.' },
  ],
  'Dance': [
    { role: 'Professional Dancer', description: 'Perform contemporary, classical ballet, or commercial dance in companies and productions.' },
    { role: 'Choreographer', description: 'Create and direct dance works for performance, film, and community contexts.' },
    { role: 'Dance Teacher', description: 'Teach technique, performance, and movement in studios, schools, and universities.' },
    { role: 'Dance Therapist', description: 'Use movement as a therapeutic tool to support mental and physical health outcomes.' },
    { role: 'Community Dance Practitioner', description: 'Develop participatory dance projects for diverse community groups.' },
  ],
  'Performing Arts': [
    { role: 'Arts Manager', description: 'Lead the strategic and operational management of performing arts organisations.' },
    { role: 'Casting Director', description: 'Identify and select talent for theatre, film, and television productions.' },
    { role: 'Talent Agent', description: 'Represent and negotiate opportunities for performing artists.' },
  ],
  'Fine Arts': [
    { role: 'Visual Artist', description: 'Create original paintings, sculpture, printmaking, or mixed-media works for exhibition and commission.' },
    { role: 'Art Educator', description: 'Teach visual arts practice and theory in schools, galleries, and universities.' },
    { role: 'Gallery Director', description: 'Lead exhibition programming, artist development, and audience engagement at a gallery.' },
    { role: 'Artist Residency Coordinator', description: 'Manage studio residency programs supporting emerging and established artists.' },
  ],
  'Photography': [
    { role: 'Commercial Photographer', description: 'Produce photography for advertising, product, corporate, and editorial clients.' },
    { role: 'Photojournalist', description: 'Document news events and social issues through photography for media outlets.' },
    { role: 'Portrait Photographer', description: 'Capture professional and personal portraits for individuals and families.' },
    { role: 'Forensic Photographer', description: 'Document crime scenes, evidence, and post-mortem examination for law enforcement.' },
  ],
  'Crafts': [
    { role: 'Craft Practitioner', description: 'Create and sell handmade objects including ceramics, textiles, metalwork, and glass.' },
    { role: 'Craft Workshop Facilitator', description: 'Teach craft skills to community groups, schools, and in therapeutic settings.' },
    { role: 'Product Designer', description: 'Apply craft and making skills to the design and development of manufactured goods.' },
  ],
  'Jewellery Making': [
    { role: 'Jeweller', description: 'Design and fabricate fine jewellery using gold, silver, platinum, and gemstones.' },
    { role: 'Gemmologist', description: 'Identify and grade precious and semi-precious stones for the jewellery trade.' },
    { role: 'Jewellery Repairer', description: 'Restore and alter jewellery items for retail and private clients.' },
    { role: 'Jewellery Designer', description: 'Create original jewellery concepts for manufacture by artisan or commercial producers.' },
  ],
  'Floristry': [
    { role: 'Florist', description: 'Design and arrange floral installations for retail, events, and corporate clients.' },
    { role: 'Event Floral Designer', description: 'Create large-scale floral styling for weddings, galas, and branded events.' },
    { role: 'Botanical Stylist', description: 'Combine plants, dried botanicals, and vessels to create contemporary interior arrangements.' },
  ],
  'Visual Arts and Crafts': [
    { role: 'Art Therapist', description: 'Use visual art-making as a therapeutic medium to support mental and emotional health.' },
    { role: 'Public Art Commissioner', description: 'Develop and manage public art programs for councils, developers, and cultural institutions.' },
  ],
  'Graphic Arts and Design Studies': [
    { role: 'Graphic Designer', description: 'Create visual identities, layouts, and digital assets for print and digital media.' },
    { role: 'Brand Designer', description: 'Develop logos, brand systems, and style guides for organisations and products.' },
    { role: 'UI Designer', description: 'Design the visual interface of apps and websites for optimal usability and aesthetics.' },
    { role: 'Motion Graphics Designer', description: 'Create animated graphics for broadcast, film, and digital media.' },
    { role: 'Packaging Designer', description: 'Design product packaging combining structural and graphic elements for retail.' },
  ],
  'Textile Design': [
    { role: 'Textile Designer', description: 'Create fabric patterns, surface treatments, and material concepts for fashion and interiors.' },
    { role: 'Print Designer', description: 'Develop repeat patterns and surface graphics for fashion, homewares, and licensing.' },
    { role: 'Sustainable Textiles Specialist', description: 'Develop and advocate for environmentally responsible fabric and fibre choices.' },
  ],
  'Fashion Design': [
    { role: 'Fashion Designer', description: 'Conceive and develop clothing and accessory collections for retail or custom clients.' },
    { role: 'Costume Designer', description: 'Create period and contemporary costumes for film, theatre, and television productions.' },
    { role: 'Fashion Stylist', description: 'Curate and present clothing and accessories for editorial, advertising, and celebrity clients.' },
    { role: 'Technical Designer', description: 'Develop garment construction specifications to ensure fit and quality in production.' },
  ],
  'Graphic and Design Studies': [
    { role: 'Creative Director', description: 'Lead the visual and conceptual direction of design teams and campaigns.' },
    { role: 'Design Researcher', description: 'Investigate user needs and design problems to inform creative practice and strategy.' },
  ],
  'Audio Visual Studies': [
    { role: 'Film Director', description: 'Lead the creative vision and on-set realisation of film and television productions.' },
    { role: 'Cinematographer', description: 'Compose and light shots to realise the visual language of a screen production.' },
    { role: 'Video Editor', description: 'Assemble and refine footage to shape narrative pacing and tone in post-production.' },
    { role: 'Sound Designer', description: 'Create the sonic world of a film, game, or performance through original and sourced audio.' },
    { role: 'Content Creator', description: 'Produce video, podcast, and multimedia content for digital platforms and audiences.' },
  ],
  'Journalism': [
    { role: 'Journalist', description: 'Research, investigate, and report on events and issues for print, broadcast, and online media.' },
    { role: 'Investigative Reporter', description: 'Conduct in-depth reporting on complex issues including corruption, health, and politics.' },
    { role: 'Broadcast Journalist', description: 'Present and produce news and current affairs content for radio and television.' },
    { role: 'Data Journalist', description: 'Analyse and visualise datasets to surface patterns and tell data-driven stories.' },
    { role: 'Media Producer', description: 'Develop editorial content and manage production workflows for digital and broadcast outlets.' },
  ],
  'Written Communication': [
    { role: 'Technical Writer', description: 'Produce user manuals, API documentation, and technical specifications for complex products.' },
    { role: 'Copywriter', description: 'Write persuasive content for advertising, web, and marketing campaigns.' },
    { role: 'Grant Writer', description: 'Craft compelling funding applications for non-profit, arts, and research organisations.' },
    { role: 'Policy Writer', description: 'Draft government and corporate policy documents and regulatory submissions.' },
  ],
  'Verbal Communication': [
    { role: 'Public Speaker', description: 'Deliver keynote addresses and presentations at conferences and corporate events.' },
    { role: 'Corporate Trainer', description: 'Facilitate communication, leadership, and workplace skills workshops for organisations.' },
    { role: 'Broadcaster', description: 'Host radio or podcast programs engaging audiences through spoken word and interview.' },
    { role: 'Voice Actor', description: 'Perform voiceovers for advertising, animation, audiobooks, and e-learning content.' },
  ],
  'Communication and Media Studies': [
    { role: 'Communications Manager', description: 'Lead strategic communications, media relations, and stakeholder engagement for an organisation.' },
    { role: 'Social Media Manager', description: 'Develop and execute social content strategies to grow audiences and drive engagement.' },
    { role: 'PR Manager', description: 'Manage brand reputation and media relationships across multiple channels.' },
  ],
  'Creative Arts': [
    { role: 'Arts Administrator', description: 'Manage operations, funding, and programs for arts organisations and cultural institutions.' },
    { role: 'Cultural Policy Adviser', description: 'Develop government strategies to support arts, culture, and creative industries.' },
    { role: 'Creative Producer', description: 'Originate and produce creative projects across film, theatre, events, and media.' },
  ],
}

const FOOD_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'Hospitality': [
    { role: 'Hotel Manager', description: 'Oversee all operations of an accommodation property to deliver exceptional guest experiences.' },
    { role: 'Restaurant Manager', description: 'Manage daily operations, staff, and guest experience in a food and beverage venue.' },
    { role: 'Event Coordinator', description: 'Plan and deliver conferences, weddings, and private functions in hospitality venues.' },
    { role: 'Front Office Manager', description: 'Lead guest services, reservations, and front desk operations in a hotel.' },
    { role: 'Revenue Manager', description: 'Optimise pricing and room inventory to maximise accommodation revenue.' },
  ],
  'Food and Beverage Service': [
    { role: 'Restaurant Supervisor', description: 'Lead front-of-house teams to deliver efficient and engaging dining service.' },
    { role: 'Sommelier', description: 'Advise restaurant guests on wine selection and manage the cellar and beverage program.' },
    { role: 'Barista', description: 'Prepare specialty coffee and espresso drinks to a high standard in café and hospitality settings.' },
    { role: 'Bar Manager', description: 'Oversee beverage menu, stock, and team operations within a bar or hotel venue.' },
    { role: 'Café Owner / Operator', description: 'Establish and run a food and beverage business from concept through to daily operations.' },
  ],
  'Butchery': [
    { role: 'Butcher', description: 'Break down whole carcasses and prepare cuts of meat for retail and food service customers.' },
    { role: 'Meat Grader', description: 'Assess and classify carcasses for yield, quality, and market specifications in abattoirs.' },
    { role: 'Charcuterie Artisan', description: 'Produce cured, smoked, and value-added meat products for specialty food markets.' },
    { role: 'Smallgoods Manufacturer', description: 'Produce salami, sausages, and deli meats in food processing facilities.' },
  ],
  'Baking and Pastrymaking': [
    { role: 'Baker', description: 'Produce breads, pastries, and baked goods in retail, wholesale, and hospitality settings.' },
    { role: 'Pastry Chef', description: 'Create desserts, cakes, and confectionery for restaurants, hotels, and patisseries.' },
    { role: 'Chocolatier', description: 'Craft handmade chocolates and confections using high-quality couverture and technique.' },
    { role: 'Artisan Bakery Owner', description: 'Operate a specialty bakery business focused on quality, craft, and community.' },
  ],
  'Cookery': [
    { role: 'Chef de Partie', description: 'Run a section of a professional kitchen, producing dishes to specification during service.' },
    { role: 'Head Chef', description: 'Lead the kitchen team, develop menus, and maintain quality in a restaurant or hotel.' },
    { role: 'Executive Chef', description: 'Set culinary direction and oversee all food production across a hotel or multi-venue operation.' },
    { role: 'Private Chef', description: 'Cook for private households, corporate clients, or charter vessels on an individual basis.' },
    { role: 'Food Stylist', description: 'Prepare and style food for photography, advertising, and media production.' },
  ],
  'Food Hygiene': [
    { role: 'Food Safety Auditor', description: 'Assess food businesses for compliance with food safety standards and HACCP requirements.' },
    { role: 'Environmental Health Officer', description: 'Investigate food safety complaints and inspect food premises for local government.' },
    { role: 'Food Safety Trainer', description: 'Deliver food handler training and food safety supervisor courses to hospitality businesses.' },
    { role: 'Quality Assurance Officer (Food)', description: 'Monitor production line hygiene and product testing in food manufacturing settings.' },
  ],
  'Food and Hospitality': [
    { role: 'Hospitality Trainer', description: 'Deliver commercial cookery, hospitality, and service training in TAFE and RTO settings.' },
    { role: 'Hospitality Consultant', description: 'Advise on menu development, operations, and business improvement for food and beverage clients.' },
  ],
  'Beauty Therapy': [
    { role: 'Beauty Therapist', description: 'Perform facials, body treatments, waxing, and nail services for clients in salons and spas.' },
    { role: 'Cosmetic Tattooist', description: 'Apply semi-permanent cosmetic procedures including eyebrows, lips, and eyeliner.' },
    { role: 'Beauty Salon Manager', description: 'Manage staff, bookings, and operations in a beauty therapy or day spa business.' },
    { role: 'Skincare Educator', description: 'Train beauty therapists in product knowledge and treatment protocols for brands or RTOs.' },
    { role: 'Makeup Artist', description: 'Apply makeup for editorial, film, weddings, and special occasions.' },
  ],
  'Hairdressing': [
    { role: 'Hairdresser', description: 'Cut, colour, and style hair for salon clients using current techniques and trends.' },
    { role: 'Salon Owner', description: 'Establish and manage a hairdressing business including staffing, marketing, and client development.' },
    { role: 'Session Stylist', description: 'Style hair for fashion shoots, film, television, and live events.' },
    { role: 'Trichologist', description: 'Diagnose and treat disorders of the scalp and hair in a clinical or specialist setting.' },
    { role: 'Hair Educator / Brand Ambassador', description: 'Deliver technique training and product education for industry brands and RTOs.' },
  ],
  'Personal Services': [
    { role: 'Nail Technician', description: 'Provide manicure, pedicure, and nail enhancement services in a salon or mobile setting.' },
    { role: 'Spa Therapist', description: 'Deliver holistic body treatments and wellness experiences in resort and day spa settings.' },
    { role: 'Personal Trainer', description: 'Design and deliver fitness programs and coaching for individual and group clients.' },
  ],
}

const MIXED_PATHWAYS: Record<string, { role: string; description: string }[]> = {
  'General Primary and Secondary Education Programmes': [
    { role: 'School Teacher', description: 'Deliver literacy, numeracy, and key learning areas in primary and secondary schools.' },
    { role: 'Remedial Tutor', description: 'Support students with foundational learning needs in one-on-one and small group settings.' },
    { role: 'Adult Literacy Educator', description: 'Teach reading, writing, and numeracy to adults in community and workplace programs.' },
  ],
  'Literacy and Numeracy Programmes': [
    { role: 'Literacy Coach', description: 'Support teachers and students to improve reading and writing outcomes across a school.' },
    { role: 'WELL Trainer', description: 'Deliver workplace literacy and numeracy programs for adult learners in vocational settings.' },
    { role: 'Learning Support Officer', description: 'Assist classroom teachers to support students with foundational learning needs.' },
  ],
  'Learning Skills Programmes': [
    { role: 'Study Skills Advisor', description: 'Coach students in time management, note-taking, and examination preparation strategies.' },
    { role: 'Academic Skills Tutor', description: 'Support tertiary students in developing research, writing, and analytical skills.' },
  ],
  'General Education Programmes': [
    { role: 'Community Educator', description: 'Deliver general education and social participation programs for diverse community groups.' },
    { role: 'TAFE Program Coordinator', description: 'Manage access and equity education programs for learners with complex needs.' },
  ],
  'Social and Interpersonal Skills Programmes': [
    { role: 'Life Skills Trainer', description: 'Teach social, communication, and interpersonal skills to individuals with disability or disadvantage.' },
    { role: 'Community Support Worker', description: 'Facilitate social skills development programs in disability and community service settings.' },
    { role: 'Youth Worker', description: 'Build the social and emotional capability of young people through structured programs.' },
  ],
  'Survival Skills Programmes': [
    { role: 'Emergency Management Officer', description: 'Train community members in first aid, disaster preparedness, and emergency response.' },
    { role: 'Outdoor Education Instructor', description: 'Teach bush survival, navigation, and risk management in natural environments.' },
    { role: 'Resilience Program Facilitator', description: 'Deliver community resilience and safety awareness programs for government agencies.' },
  ],
  'Parental Education Programmes': [
    { role: 'Parenting Educator', description: 'Deliver structured parenting programs to support child development and family wellbeing.' },
    { role: 'Family Support Worker', description: 'Provide practical guidance and early intervention to families at risk.' },
    { role: 'Child and Family Health Nurse', description: 'Support new parents with infant care, development, and family adjustment.' },
  ],
  'Social Skills Programmes': [
    { role: 'Social Skills Trainer', description: 'Facilitate group programs to develop communication, empathy, and conflict resolution skills.' },
    { role: 'Disability Support Worker', description: 'Support individuals to develop social confidence and community participation.' },
  ],
  'Career Development Programmes': [
    { role: 'Career Counsellor', description: 'Guide individuals in career exploration, skill assessment, and goal setting.' },
    { role: 'Employment Consultant', description: 'Match job seekers with employers and provide job search coaching.' },
    { role: 'Vocational Assessment Officer', description: 'Assess skills and interests to recommend suitable training and career pathways.' },
  ],
  'Job Search Skills Programmes': [
    { role: 'Job Search Trainer', description: 'Teach resume writing, interview technique, and job application skills in employment programs.' },
    { role: 'Employment Services Worker', description: 'Support job seekers with barriers to employment through case management and referral.' },
    { role: 'Disability Employment Consultant', description: 'Help people with disability secure and sustain meaningful employment.' },
  ],
  'Work Practices Programmes': [
    { role: 'Workplace Trainer', description: 'Deliver on-the-job skills training and induction programs for employees.' },
    { role: 'WHS Trainer', description: 'Train workers in workplace health, safety, and compliance requirements.' },
    { role: 'Productivity Coach', description: 'Improve individual and team work practices through coaching and structured review.' },
  ],
  'Employment Skills Programmes': [
    { role: 'Employment Program Manager', description: 'Lead workforce development and employment programs for government and community organisations.' },
    { role: 'Industry Liaison Officer', description: 'Build partnerships between employment service providers and employer networks.' },
  ],
  'Mixed Field Programmes': [
    { role: 'Community Program Coordinator', description: 'Design and manage cross-sector social programs addressing multiple community needs.' },
    { role: 'Social Policy Officer', description: 'Develop holistic policy responses to complex social disadvantage and inequality.' },
  ],
}

const DOMAIN_PATHWAYS: Record<string, Record<string, { role: string; description: string }[]>> = {
  sci: SCI_PATHWAYS,
  it: IT_PATHWAYS,
  eng: ENG_PATHWAYS,
  arch: ARCH_PATHWAYS,
  agri: AGRI_PATHWAYS,
  health: HEALTH_PATHWAYS,
  edu: EDU_PATHWAYS,
  mgmt: MGMT_PATHWAYS,
  soc: SOC_PATHWAYS,
  arts: ARTS_PATHWAYS,
  food: FOOD_PATHWAYS,
  mixed: MIXED_PATHWAYS,
}

const DOMAINS = [
  {
    id: 'sci',
    name: 'Natural & Physical Sciences',
    color: '#38bdf8',
    emoji: '⚛',
    subdomains: [
      { name: 'Mathematical Sciences', fields: ['Mathematics', 'Statistics', 'Mathematical Sciences'] },
      { name: 'Physics and Astronomy', fields: ['Physics', 'Astronomy'] },
      { name: 'Chemical Sciences', fields: ['Organic Chemistry', 'Inorganic Chemistry', 'Chemical Sciences'] },
      { name: 'Earth Sciences', fields: ['Atmospheric Sciences', 'Geology', 'Geophysics', 'Geochemistry', 'Soil Science', 'Hydrology', 'Oceanography', 'Earth Sciences'] },
      { name: 'Biological Sciences', fields: ['Biochemistry and Cell Biology', 'Botany', 'Ecology and Evolution', 'Marine Science', 'Genetics', 'Microbiology', 'Human Biology', 'Zoology', 'Biological Sciences'] },
      { name: 'Other Natural Sciences', fields: ['Medical Science', 'Forensic Science', 'Food Science and Biotechnology', 'Pharmacology', 'Laboratory Technology'] },
    ],
  },
  {
    id: 'it',
    name: 'Information Technology',
    color: '#a78bfa',
    emoji: '⌨',
    subdomains: [
      { name: 'Computer Science', fields: ['Formal Language Theory', 'Programming', 'Computational Theory', 'Compiler Construction', 'Algorithms', 'Data Structures', 'Networks and Communications', 'Computer Graphics', 'Operating Systems', 'Artificial Intelligence', 'Computer Science'] },
      { name: 'Information Systems', fields: ['Conceptual Modelling', 'Database Management', 'Systems Analysis and Design', 'Decision Support Systems', 'Information Systems'] },
      { name: 'Other Information Technology', fields: ['Security Science', 'Information Technology'] },
    ],
  },
  {
    id: 'eng',
    name: 'Engineering & Technologies',
    color: '#fb923c',
    emoji: '⚙',
    subdomains: [
      { name: 'Manufacturing Engineering', fields: ['Manufacturing Engineering', 'Printing', 'Textile Making', 'Garment Making', 'Footwear Making', 'Wood Machining and Turning', 'Cabinet Making', 'Furniture Upholstery and Renovation', 'Furniture Polishing'] },
      { name: 'Process & Resources Engineering', fields: ['Chemical Engineering', 'Mining Engineering', 'Materials Engineering', 'Food Processing Technology'] },
      { name: 'Automotive Engineering', fields: ['Automotive Engineering', 'Vehicle Mechanics', 'Automotive Electrics and Electronics', 'Automotive Vehicle Refinishing', 'Automotive Body Construction', 'Panel Beating', 'Upholstery and Vehicle Trimming'] },
      { name: 'Mechanical & Industrial Engineering', fields: ['Mechanical Engineering', 'Industrial Engineering', 'Toolmaking', 'Metal Fitting', 'Turning and Machining', 'Sheetmetal Working', 'Boilermaking and Welding', 'Metal Casting and Patternmaking', 'Precision Metalworking', 'Plant and Machine Operations'] },
      { name: 'Civil Engineering', fields: ['Construction Engineering', 'Structural Engineering', 'Building Services Engineering', 'Water and Sanitary Engineering', 'Transport Engineering', 'Geotechnical Engineering', 'Ocean Engineering', 'Civil Engineering'] },
      { name: 'Geomatic Engineering', fields: ['Surveying', 'Mapping Science', 'Geomatic Engineering'] },
      { name: 'Electrical & Electronic Engineering', fields: ['Electrical Engineering', 'Electronic Engineering', 'Computer Engineering', 'Communications Technologies', 'Powerline Installation and Maintenance', 'Electrical Fitting', 'Electrical Mechanics', 'Refrigeration and Air Conditioning Mechanics', 'Electronic Equipment Servicing'] },
      { name: 'Aerospace Engineering', fields: ['Aerospace Engineering', 'Aircraft Maintenance Engineering', 'Aircraft Operation', 'Air Traffic Control'] },
      { name: 'Maritime Engineering', fields: ['Maritime Engineering', 'Marine Construction', 'Marine Craft Operation'] },
      { name: 'Other Engineering', fields: ['Environmental Engineering', 'Biomedical Engineering', 'Fire Technology', 'Rail Operations', 'Cleaning'] },
    ],
  },
  {
    id: 'arch',
    name: 'Architecture & Building',
    color: '#f472b6',
    emoji: '🏛',
    subdomains: [
      { name: 'Architecture & Urban Environment', fields: ['Architecture', 'Urban Design and Regional Planning', 'Landscape Architecture', 'Interior and Environmental Design'] },
      { name: 'Building', fields: ['Building Science and Technology', 'Building Construction Management', 'Building Surveying', 'Building Construction Economics', 'Bricklaying and Stonemasonry', 'Carpentry and Joinery', 'Ceiling, Wall and Floor Fixing', 'Roof Fixing', 'Plastering', 'Furnishing Installation', 'Floor Coverings', 'Glazing', 'Painting, Decorating and Sign Writing', 'Plumbing', 'Scaffolding and Rigging'] },
    ],
  },
  {
    id: 'agri',
    name: 'Agriculture & Environment',
    color: '#4ade80',
    emoji: '🌿',
    subdomains: [
      { name: 'Agriculture', fields: ['Agricultural Science', 'Wool Science', 'Animal Husbandry', 'Agriculture'] },
      { name: 'Horticulture and Viticulture', fields: ['Horticulture', 'Viticulture'] },
      { name: 'Forestry Studies', fields: ['Forestry Studies'] },
      { name: 'Fisheries Studies', fields: ['Aquaculture', 'Fisheries Studies'] },
      { name: 'Environmental Studies', fields: ['Land, Parks and Wildlife Management', 'Environmental Studies'] },
      { name: 'Other Agriculture', fields: ['Pest and Weed Control', 'Agriculture, Environmental and Related Studies'] },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    color: '#f87171',
    emoji: '✚',
    subdomains: [
      { name: 'Medical Studies', fields: ['General Medicine', 'Surgery', 'Psychiatry', 'Obstetrics and Gynaecology', 'Paediatrics', 'Anaesthesiology', 'Pathology', 'Radiology', 'Internal Medicine', 'General Practice'] },
      { name: 'Nursing', fields: ['General Nursing', 'Midwifery', 'Mental Health Nursing', 'Community Nursing', 'Critical Care Nursing', 'Aged Care Nursing', 'Palliative Care Nursing', 'Mothercraft Nursing and Family and Child Health Nursing'] },
      { name: 'Pharmacy', fields: ['Pharmacy'] },
      { name: 'Dental Studies', fields: ['Dentistry', 'Dental Assisting', 'Dental Technology'] },
      { name: 'Optical Science', fields: ['Optometry', 'Optical Technology', 'Optical Science'] },
      { name: 'Veterinary Studies', fields: ['Veterinary Science', 'Veterinary Assisting'] },
      { name: 'Public Health', fields: ['Occupational Health and Safety', 'Environmental Health', 'Indigenous Health', 'Health Promotion', 'Community Health', 'Epidemiology'] },
      { name: 'Radiography', fields: ['Radiography'] },
      { name: 'Rehabilitation Therapies', fields: ['Physiotherapy', 'Occupational Therapy', 'Chiropractic and Osteopathy', 'Speech Pathology', 'Audiology', 'Massage Therapy', 'Podiatry'] },
      { name: 'Complementary Therapies', fields: ['Naturopathy', 'Acupuncture', 'Traditional Chinese Medicine'] },
      { name: 'Other Health', fields: ['Nutrition and Dietetics', 'Human Movement', 'Paramedical Studies', 'First Aid'] },
    ],
  },
  {
    id: 'edu',
    name: 'Education',
    color: '#facc15',
    emoji: '📖',
    subdomains: [
      { name: 'Teacher Education', fields: ['Teacher Education: Early Childhood', 'Teacher Education: Primary', 'Teacher Education: Secondary', 'Teacher-Librarianship', 'Teacher Education: Vocational Education and Training', 'Teacher Education: Higher Education', 'Teacher Education: Special Education', 'English as a Second Language Teaching', 'Nursing Education Teacher Training'] },
      { name: 'Curriculum and Education Studies', fields: ['Curriculum Studies', 'Education Studies'] },
      { name: 'Other Education', fields: ['Education'] },
    ],
  },
  {
    id: 'mgmt',
    name: 'Management & Commerce',
    color: '#60a5fa',
    emoji: '◈',
    subdomains: [
      { name: 'Accounting', fields: ['Accounting'] },
      { name: 'Business and Management', fields: ['Business Management', 'Human Resource Management', 'Personal Management Training', 'Organisation Management', 'Industrial Relations', 'International Business', 'Public and Health Care Administration', 'Project Management', 'Quality Management', 'Hospitality Management', 'Farm Management and Agribusiness', 'Tourism Management'] },
      { name: 'Sales and Marketing', fields: ['Sales', 'Real Estate', 'Marketing', 'Advertising', 'Public Relations'] },
      { name: 'Tourism', fields: ['Tourism'] },
      { name: 'Office Studies', fields: ['Secretarial and Clerical Studies', 'Keyboard Skills', 'Practical Computing Skills', 'Office Studies'] },
      { name: 'Banking, Finance and Related Fields', fields: ['Banking and Finance', 'Insurance and Actuarial Studies', 'Investment and Securities'] },
      { name: 'Other Management and Commerce', fields: ['Purchasing, Warehousing and Distribution', 'Valuation'] },
    ],
  },
  {
    id: 'soc',
    name: 'Society & Culture',
    color: '#e879f9',
    emoji: '◎',
    subdomains: [
      { name: 'Political Science and Policy Studies', fields: ['Political Science', 'Policy Studies'] },
      { name: 'Studies in Human Society', fields: ['Sociology', 'Anthropology', 'History', 'Archaeology', 'Human Geography', 'Indigenous Studies', 'Gender Specific Studies'] },
      { name: 'Human Welfare Studies and Services', fields: ['Social Work', "Children's Services", 'Youth Work', 'Care for the Aged', 'Care for the Disabled', 'Residential Client Care', 'Counselling', 'Welfare Studies'] },
      { name: 'Behavioural Science', fields: ['Psychology', 'Behavioural Science'] },
      { name: 'Law', fields: ['Business and Commercial Law', 'Constitutional Law', 'Criminal Law', 'Family Law', 'International Law', 'Taxation Law', 'Legal Practice'] },
      { name: 'Justice and Law Enforcement', fields: ['Justice Administration', 'Legal Studies', 'Police Studies'] },
      { name: 'Librarianship and Information Management', fields: ['Librarianship and Information Management', 'Curatorial Studies'] },
      { name: 'Language and Literature', fields: ['English Language', 'Northern European Languages', 'Southern European Languages', 'Eastern European Languages', 'Southwest Asian and North African Languages', 'Southern Asian Languages', 'Southeast Asian Languages', 'Eastern Asian Languages', 'Indigenous Languages', 'Translating and Interpreting', 'Linguistics', 'Literature'] },
      { name: 'Philosophy and Religious Studies', fields: ['Philosophy', 'Religious Studies'] },
      { name: 'Economics and Econometrics', fields: ['Economics', 'Econometrics'] },
      { name: 'Sport and Recreation', fields: ['Sport and Recreation Activities', 'Sports Coaching, Officiating and Instruction', 'Sport and Recreation'] },
      { name: 'Other Society and Culture', fields: ['Family and Consumer Studies', 'Criminology', 'Security Services'] },
    ],
  },
  {
    id: 'arts',
    name: 'Creative Arts',
    color: '#fb7185',
    emoji: '◇',
    subdomains: [
      { name: 'Performing Arts', fields: ['Music', 'Drama and Theatre Studies', 'Dance', 'Performing Arts'] },
      { name: 'Visual Arts and Crafts', fields: ['Fine Arts', 'Photography', 'Crafts', 'Jewellery Making', 'Floristry'] },
      { name: 'Graphic and Design Studies', fields: ['Graphic Arts and Design Studies', 'Textile Design', 'Fashion Design'] },
      { name: 'Communication and Media Studies', fields: ['Audio Visual Studies', 'Journalism', 'Written Communication', 'Verbal Communication'] },
      { name: 'Other Creative Arts', fields: ['Creative Arts'] },
    ],
  },
  {
    id: 'food',
    name: 'Food, Hospitality & Personal Services',
    color: '#fdba74',
    emoji: '◉',
    subdomains: [
      { name: 'Food and Hospitality', fields: ['Hospitality', 'Food and Beverage Service', 'Butchery', 'Baking and Pastrymaking', 'Cookery', 'Food Hygiene'] },
      { name: 'Personal Services', fields: ['Beauty Therapy', 'Hairdressing', 'Personal Services'] },
    ],
  },
  {
    id: 'mixed',
    name: 'Mixed Field Programmes',
    color: '#94a3b8',
    emoji: '⊕',
    subdomains: [
      { name: 'General Education Programmes', fields: ['General Primary and Secondary Education Programmes', 'Literacy and Numeracy Programmes', 'Learning Skills Programmes'] },
      { name: 'Social Skills Programmes', fields: ['Social and Interpersonal Skills Programmes', 'Survival Skills Programmes', 'Parental Education Programmes'] },
      { name: 'Employment Skills Programmes', fields: ['Career Development Programmes', 'Job Search Skills Programmes', 'Work Practices Programmes'] },
      { name: 'Other Mixed Field Programmes', fields: ['Mixed Field Programmes'] },
    ],
  },
]

function hex2rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function App() {
  const [activeDomainIdx, setActiveDomainIdx] = useState<number | null>(null)
  const [activeSubIdx, setActiveSubIdx] = useState<number | null>(null)
  const [popup, setPopup] = useState<{ field: string; x: number; y: number } | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!popup) return
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopup(null)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPopup(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [popup])

  const domain = activeDomainIdx !== null ? DOMAINS[activeDomainIdx] : null
  const subdomain = domain && activeSubIdx !== null ? domain.subdomains[activeSubIdx] : null

  const totalFields = useMemo(() =>
    DOMAINS.reduce((sum, d) => sum + d.subdomains.reduce((s, sd) => s + sd.fields.length, 0), 0),
    []
  )

  function handleDomainClick(idx: number) {
    if (activeDomainIdx === idx) {
      setActiveDomainIdx(null)
      setActiveSubIdx(null)
    } else {
      setActiveDomainIdx(idx)
      setActiveSubIdx(null)
    }
  }

  function handleSubClick(idx: number) {
    setActiveSubIdx(activeSubIdx === idx ? null : idx)
  }

  const col = domain?.color ?? '#38bdf8'

  return (
    <div style={{ background: '#060612', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Star field */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.6) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 72% 8%, rgba(255,255,255,0.5) 0%, transparent 100%)',
            'radial-gradient(1.5px 1.5px at 43% 55%, rgba(255,255,255,0.4) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 88% 32%, rgba(255,255,255,0.6) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 27% 79%, rgba(255,255,255,0.35) 0%, transparent 100%)',
            'radial-gradient(1.5px 1.5px at 60% 88%, rgba(255,255,255,0.5) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 5% 46%, rgba(255,255,255,0.4) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 93% 71%, rgba(255,255,255,0.5) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 52% 13%, rgba(255,255,255,0.45) 0%, transparent 100%)',
            'radial-gradient(1.5px 1.5px at 33% 37%, rgba(255,255,255,0.3) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 79% 62%, rgba(255,255,255,0.55) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 18% 93%, rgba(255,255,255,0.4) 0%, transparent 100%)',
          ].join(', '),
        }} />
        {/* Nebula glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(56,189,248,0.04) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 80% 70%, rgba(167,139,250,0.04) 0%, transparent 60%)',
        }} />
      </div>

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, padding: '48px 48px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, boxShadow: `0 0 12px ${col}`, transition: 'all 0.4s ease' }} />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase' }}>
              Knowledge Navigator
            </span>
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px', color: '#f1f5f9' }}>
            Academic Fields Explorer
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#94a3b8', maxWidth: 560, margin: 0 }}>
            A navigable map of academic disciplines across{' '}
            <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{DOMAINS.length} domains</span>{' '}
            and over <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{totalFields} specialisations</span>.{' '}
            <span style={{ color: '#475569', fontStyle: 'italic' }}>
              Note: this is not an exhaustive list — many emerging, interdisciplinary, and regional fields are not represented here.
            </span>
          </p>
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{ position: 'relative', zIndex: 10, height: 40, display: 'flex', alignItems: 'center', padding: '0 48px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 8, fontSize: 12, color: '#475569', fontFamily: 'Outfit, sans-serif' }}>
        <span style={{ color: '#334155' }}>All fields</span>
        {domain && (
          <>
            <span>›</span>
            <span style={{ color: domain.color }}>{domain.name}</span>
          </>
        )}
        {subdomain && (
          <>
            <span>›</span>
            <span style={{ color: '#94a3b8' }}>{subdomain.name}</span>
          </>
        )}
        {!domain && (
          <span style={{ marginLeft: 8, color: '#1e293b', fontSize: 11, fontStyle: 'italic' }}>
            Select a domain to begin exploring
          </span>
        )}
      </div>

      {/* Main 3-column explorer */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '280px 1fr 1fr',
        gap: 0,
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Column 1: Domains */}
        <div style={{
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflowY: 'auto',
          padding: '16px 0',
        }}>
          <div style={{ padding: '0 16px 8px', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', color: '#334155', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>
            Domains
          </div>
          {DOMAINS.map((d, i) => {
            const isActive = activeDomainIdx === i
            const total = d.subdomains.reduce((s, sd) => s + sd.fields.length, 0)
            return (
              <button
                key={d.id}
                onClick={() => handleDomainClick(i)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: isActive ? hex2rgba(d.color, 0.08) : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? d.color : 'transparent'}`,
                  padding: '10px 16px 10px 13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.18s ease',
                  color: isActive ? '#f1f5f9' : '#64748b',
                  fontFamily: 'Outfit, sans-serif',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                    ;(e.currentTarget as HTMLElement).style.color = '#94a3b8'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#64748b'
                  }
                }}
              >
                <span style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 6,
                  fontSize: 14,
                  background: isActive ? hex2rgba(d.color, 0.15) : 'rgba(255,255,255,0.04)',
                  color: isActive ? d.color : '#475569',
                  flexShrink: 0,
                  transition: 'all 0.18s ease',
                }}>
                  {d.emoji}
                </span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, lineHeight: 1.3, flex: 1 }}>
                  {d.name}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  color: isActive ? d.color : '#1e293b',
                  background: isActive ? hex2rgba(d.color, 0.12) : 'rgba(255,255,255,0.04)',
                  padding: '2px 6px', borderRadius: 4,
                  transition: 'all 0.18s ease',
                  flexShrink: 0,
                }}>
                  {total}
                </span>
              </button>
            )
          })}
        </div>

        {/* Column 2: Sub-domains */}
        <div style={{
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflowY: 'auto',
          padding: '16px',
          position: 'relative',
        }}>
          {domain ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: domain.color, boxShadow: `0 0 8px ${domain.color}` }} />
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', color: domain.color, textTransform: 'uppercase', opacity: 0.8 }}>
                  {domain.subdomains.length} sub-domains
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {domain.subdomains.map((sd, i) => {
                  const isActive = activeSubIdx === i
                  return (
                    <button
                      key={i}
                      onClick={() => handleSubClick(i)}
                      style={{
                        textAlign: 'left',
                        background: isActive ? hex2rgba(domain.color, 0.1) : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isActive ? hex2rgba(domain.color, 0.4) : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        transition: 'all 0.18s ease',
                        color: isActive ? '#f1f5f9' : '#94a3b8',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
                          ;(e.currentTarget as HTMLElement).style.color = '#e2e8f0'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                          ;(e.currentTarget as HTMLElement).style.color = '#94a3b8'
                        }
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, lineHeight: 1.3, marginBottom: 3 }}>
                          {sd.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#475569' }}>
                          {sd.fields.length} {sd.fields.length === 1 ? 'field' : 'fields'}
                        </div>
                      </div>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isActive ? hex2rgba(domain.color, 0.2) : 'rgba(255,255,255,0.04)',
                        color: isActive ? domain.color : '#334155',
                        fontSize: 14,
                        transition: 'all 0.18s ease',
                        flexShrink: 0,
                      }}>
                        {isActive ? '›' : '›'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <EmptyState col={1} />
          )}
        </div>

        {/* Column 3: Fields */}
        <div style={{
          overflowY: 'auto',
          padding: '16px',
        }}>
          {subdomain && domain ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: domain.color, boxShadow: `0 0 8px ${domain.color}` }} />
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', color: domain.color, textTransform: 'uppercase', opacity: 0.8 }}>
                  {subdomain.fields.length} specialisations
                </span>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 16, lineHeight: 1.3 }}>
                {subdomain.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {subdomain.fields.map((field, i) => {
                  const domainPathways = DOMAIN_PATHWAYS[domain.id]
                  const hasPathways = !!(domainPathways?.[field])
                  const isActive = popup?.field === field
                  return (
                    <span
                      key={i}
                      onClick={hasPathways ? e => {
                        e.stopPropagation()
                        if (isActive) { setPopup(null); return }
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                        setPopup({ field, x: rect.left, y: rect.bottom + 8 })
                      } : undefined}
                      style={{
                        padding: '7px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        background: isActive ? hex2rgba(domain.color, 0.18) : hex2rgba(domain.color, 0.08),
                        border: `1px solid ${isActive ? hex2rgba(domain.color, 0.5) : hex2rgba(domain.color, 0.2)}`,
                        color: isActive ? '#f1f5f9' : '#cbd5e1',
                        transition: 'all 0.15s ease',
                        cursor: hasPathways ? 'pointer' : 'default',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: isActive ? `0 0 16px ${hex2rgba(domain.color, 0.2)}` : 'none',
                        userSelect: 'none',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = hex2rgba(domain.color, 0.16)
                          ;(e.currentTarget as HTMLElement).style.borderColor = hex2rgba(domain.color, 0.4)
                          ;(e.currentTarget as HTMLElement).style.color = '#f1f5f9'
                          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${hex2rgba(domain.color, 0.15)}`
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = hex2rgba(domain.color, 0.08)
                          ;(e.currentTarget as HTMLElement).style.borderColor = hex2rgba(domain.color, 0.2)
                          ;(e.currentTarget as HTMLElement).style.color = '#cbd5e1'
                          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                        }
                      }}
                    >
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: domain.color, opacity: 0.7, flexShrink: 0 }} />
                      {field}
                      {hasPathways && (
                        <span style={{ fontSize: 9, opacity: 0.5, marginLeft: 2, fontFamily: 'Outfit, sans-serif' }}>▸</span>
                      )}
                    </span>
                  )
                })}
              </div>
            </>
          ) : domain ? (
            <EmptyState col={2} domain={domain} />
          ) : (
            <EmptyState col={1} />
          )}
        </div>
      </div>

      {/* Employment Pathways Popup */}
      {popup && domain && DOMAIN_PATHWAYS[domain.id]?.[popup.field] && (
        <PathwaysPopup
          ref={popupRef}
          field={popup.field}
          pathways={DOMAIN_PATHWAYS[domain.id][popup.field]}
          x={popup.x}
          y={popup.y}
          color={domain.color}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Footer stat bar */}
      <div style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.04)', padding: '12px 48px', display: 'flex', gap: 32, fontSize: 11, color: '#334155', fontFamily: 'Outfit, sans-serif' }}>
        {[
          { label: 'Domains', value: DOMAINS.length },
          { label: 'Sub-domains', value: DOMAINS.reduce((s, d) => s + d.subdomains.length, 0) },
          { label: 'Specialisations', value: totalFields },
        ].map(stat => (
          <div key={stat.label} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>{stat.value}</span>
            <span>{stat.label}</span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontStyle: 'italic', color: '#1e293b' }}>
          Source: Australian Standard Classification of Education (ASCED)
        </span>
      </div>
    </div>
  )
}

const PathwaysPopup = forwardRef<HTMLDivElement, {
  field: string
  pathways: { role: string; description: string }[]
  x: number
  y: number
  color: string
  onClose: () => void
}>(function PathwaysPopup({ field, pathways, x, y, color, onClose }, ref) {
  const viewportWidth = window.innerWidth
  const popupWidth = 340
  const left = Math.min(x, viewportWidth - popupWidth - 16)
  const top = Math.min(y, window.innerHeight - 420)

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left,
        top,
        width: popupWidth,
        zIndex: 100,
        background: '#0d0d28',
        border: `1px solid ${hex2rgba(color, 0.3)}`,
        borderRadius: 14,
        boxShadow: `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${hex2rgba(color, 0.08)}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: `1px solid rgba(255,255,255,0.06)`,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        background: hex2rgba(color, 0.05),
      }}>
        <div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', color, textTransform: 'uppercase', marginBottom: 4, opacity: 0.8 }}>
            Employment Pathways
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>
            {field}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            color: '#64748b',
            cursor: 'pointer',
            fontSize: 14,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          ×
        </button>
      </div>

      {/* Pathways list */}
      <div style={{ padding: '10px 0', maxHeight: 340, overflowY: 'auto' }}>
        {pathways.map((p, i) => (
          <div
            key={i}
            style={{
              padding: '10px 16px',
              borderBottom: i < pathways.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: color,
              boxShadow: `0 0 6px ${hex2rgba(color, 0.6)}`,
              flexShrink: 0,
              marginTop: 5,
            }} />
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 3 }}>
                {p.role}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.55 }}>
                {p.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

function EmptyState({ col, domain }: { col: number; domain?: typeof DOMAINS[0] }) {
  const messages = [
    { heading: 'Choose a domain', sub: 'Select a field of study from the left panel to begin exploring its sub-disciplines.' },
    { heading: 'Choose a sub-domain', sub: `${domain?.name ?? 'This domain'} contains ${domain?.subdomains.length ?? ''} sub-domains. Select one to view its specialisations.` },
  ]
  const msg = messages[col - 1] ?? messages[0]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 240, gap: 12, textAlign: 'center', padding: 32 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, color: '#1e293b',
        background: 'rgba(255,255,255,0.02)',
        marginBottom: 4,
      }}>
        {col === 1 ? '⊛' : '⊙'}
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600, color: '#334155' }}>
        {msg.heading}
      </div>
      <div style={{ fontSize: 12, color: '#1e293b', lineHeight: 1.6, maxWidth: 220 }}>
        {msg.sub}
      </div>
    </div>
  )
}
